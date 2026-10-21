// @vitest-environment node
// POST /api/job-applications/apply entegrasyon testleri.
// Yalnızca geçici bir test DB'siyle çalışır: CV_TEST_DATABASE_URL tanımlı ve DB adı "_cvtest" ile
// bitmeli. Aksi halde tüm grup atlanır (geliştirme/canlı DB'ye asla bağlanmaz).
// Örnek: createdb localhostusak_cvtest && CV_TEST_DATABASE_URL=postgres://<kullanıcı>@127.0.0.1:5432/localhostusak_cvtest npx vitest run tests/int/job-applications-apply.int.spec.ts
import fs from 'fs'
import os from 'os'
import path from 'path'
import type { Payload, PayloadHandler } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { CV_FILENAME_RE } from '@/lib/cv/filename'
import { hashClientIp } from '@/lib/http/clientIp'

import { activePdf, cleanPdf, codecPdf, embeddedPdf, encryptedPdf } from '../helpers/pdf'

const TEST_DB_URL = process.env.CV_TEST_DATABASE_URL
const canRun = Boolean(TEST_DB_URL && /_cvtest(\?.*)?$/.test(new URL(TEST_DB_URL).pathname + new URL(TEST_DB_URL).search))

const COLLECTION = 'job-applications'
const IP_SECRET = 'test-ip-hash-secret'
const testEnv = { NODE_ENV: 'test', CV_IP_HASH_SECRET: IP_SECRET } as unknown as NodeJS.ProcessEnv

let payload: Payload
let handler: PayloadHandler
let createReq: (request: Request) => Promise<Parameters<PayloadHandler>[0]>
let storageDir: string

type FormOverrides = Record<string, string | string[] | File | null>

function buildForm(overrides: FormOverrides = {}): FormData {
  const base: FormOverrides = {
    candidateName: 'Test Kullanıcı',
    email: `aday-${Math.random().toString(36).slice(2)}@example.com`,
    phone: '+90 555 000 00 00',
    linkedinUrl: 'https://www.linkedin.com/in/test',
    githubUrl: 'https://github.com/test',
    experienceLevel: 'junior',
    fieldsOfInterest: ['frontend', 'backend'],
    consent: 'true',
    fillMs: '10000',
    cv: new File([new Uint8Array(cleanPdf())], 'Ahmet_Yilmaz_CV.pdf', { type: 'application/pdf' }),
  }
  const form = new FormData()
  for (const [key, value] of Object.entries({ ...base, ...overrides })) {
    if (value === null) continue
    if (Array.isArray(value)) value.forEach((v) => form.append(key, v))
    else form.append(key, value)
  }
  return form
}

async function post(
  form: FormData,
  { ip = '203.0.113.10', contentLength, omitLength = false }: { ip?: string; contentLength?: number; omitLength?: boolean } = {},
) {
  const encoded = new Response(form)
  const body = Buffer.from(await encoded.arrayBuffer())
  const headers: Record<string, string> = {
    'content-type': encoded.headers.get('content-type') ?? '',
    'x-forwarded-for': `6.6.6.6, ${ip}`, // ilk değer sahte; son değer proxy'nin eklediği
  }
  if (!omitLength) headers['content-length'] = String(contentLength ?? body.length)
  const request = new Request('http://localhost:3000/api/job-applications/apply', { method: 'POST', body, headers })
  const response = await handler(await createReq(request))
  return { status: response.status, json: (await response.json()) as Record<string, unknown> }
}

const count = async () => (await payload.count({ collection: COLLECTION, overrideAccess: true })).totalDocs
const setFlag = (enabled: boolean) =>
  payload.updateGlobal({
    slug: 'careers-page-settings',
    data: { applicationForm: { enabled, consentVersion: 'cv-test-1' } },
  })

describe.skipIf(!canRun)('POST /api/job-applications/apply', () => {
  beforeAll(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-apply-test-'))
    process.env.DATABASE_URL = TEST_DB_URL
    process.env.CV_STORAGE_DIR = storageDir
    process.env.CV_IP_HASH_SECRET = IP_SECRET

    const { getPayload, createPayloadRequest } = await import('payload')
    const config = (await import('@/payload.config')).default
    payload = await getPayload({ config })
    createReq = (request) => createPayloadRequest({ config, request })
    const endpoint = payload.collections[COLLECTION].config.endpoints
    handler = (Array.isArray(endpoint) ? endpoint : []).find((e) => e.path === '/apply')!.handler
  }, 120_000)

  afterAll(async () => {
    await payload?.db?.destroy?.()
    fs.rmSync(storageDir, { recursive: true, force: true })
  })

  it('bayrak kapalıyken 503 döner ve hiçbir şey yazmaz', async () => {
    await setFlag(false)
    const before = await count()
    const res = await post(buildForm())
    expect(res.status).toBe(503)
    expect(res.json.code).toBe('disabled')
    expect(await count()).toBe(before)
    expect(fs.readdirSync(storageDir)).toEqual([])
  })

  it('geçerli başvuru kaydedilir; yalnızca whitelist alanlar alınır, sunucu alanları sunucuda dolar', async () => {
    await setFlag(true)
    const res = await post(
      buildForm({
        email: 'Whitelist@Example.com',
        status: 'contacted',
        notes: 'saldırgan notu',
        ipHash: 'sahte',
        scanEngines: 'sahte',
        consentAt: '2000-01-01T00:00:00.000Z',
        consentTextVersion: 'sahte',
      }),
      { ip: '203.0.113.20' },
    )
    expect(res).toEqual({ status: 201, json: { success: true } })

    const { docs } = await payload.find({ collection: COLLECTION, where: { email: { equals: 'whitelist@example.com' } }, overrideAccess: true })
    expect(docs).toHaveLength(1)
    const doc = docs[0]
    expect(doc.status).toBe('new')
    expect(doc.notes ?? null).toBeNull()
    expect(doc.consentGiven).toBe(true)
    expect(doc.consentTextVersion).toBe('cv-test-1')
    expect(Date.now() - new Date(doc.consentAt).getTime()).toBeLessThan(60_000)
    expect(doc.scanEngines).toBe('pdf-active-content')
    const expectedHash = hashClientIp('203.0.113.20', testEnv)
    expect(expectedHash.ok && doc.ipHash === expectedHash.hash).toBe(true)
    expect(doc.filename).toMatch(CV_FILENAME_RE)
    expect(doc.filename).not.toMatch(/ahmet|yilmaz/i)
    expect(fs.existsSync(path.join(storageDir, doc.filename!))).toBe(true)
  })

  it('aynı e-postayla 24 saat içinde ikinci başvuru genel mesajla reddedilir', async () => {
    const form = () => buildForm({ email: 'tekrar@example.com' })
    expect((await post(form(), { ip: '203.0.113.30' })).status).toBe(201)
    const second = await post(form(), { ip: '203.0.113.31' })
    expect(second.status).toBe(429)
    expect(second.json.code).toBe('rate_limited')
    expect(String(second.json.message)).not.toMatch(/e-posta/i) // başvuru varlığı sızmasın
  })

  it('KVKK rızası olmadan ve geçersiz alanlarla reddedilir', async () => {
    const noConsent = await post(buildForm({ consent: null }), { ip: '203.0.113.40' })
    expect(noConsent.status).toBe(400)
    expect(noConsent.json.code).toBe('consent_missing')

    const invalid = await post(
      buildForm({ email: 'gecersiz', experienceLevel: 'cto', fieldsOfInterest: ['blockchain'], linkedinUrl: 'http://x.com' }),
      { ip: '203.0.113.41' },
    )
    expect(invalid.status).toBe(400)
    expect(invalid.json.code).toBe('validation')
    expect(invalid.json.fields).toEqual(['email', 'linkedinUrl', 'experienceLevel', 'fieldsOfInterest'])
  })

  it('honeypot dolu veya form çok hızlı gönderilirse başarı döner ama kayıt oluşmaz; sebep tek satır loglanır', async () => {
    const before = await count()
    const warns: string[] = []
    const original = payload.logger.warn.bind(payload.logger)
    payload.logger.warn = ((msg: unknown) => {
      warns.push(String(msg))
      return original(msg as never)
    }) as typeof payload.logger.warn
    try {
      expect((await post(buildForm({ q7zk_x2m: 'http://spam' }), { ip: '203.0.113.50' })).status).toBe(201)
      expect((await post(buildForm({ fillMs: '500' }), { ip: '203.0.113.51' })).status).toBe(201)
      // Saat kayması etkisiz: negatif süre de "çok hızlı" sayılır; reddedilmez (400 değil)
      expect((await post(buildForm({ fillMs: '-86400000' }), { ip: '203.0.113.52' })).status).toBe(201)
    } finally {
      payload.logger.warn = original as typeof payload.logger.warn
    }
    expect(await count()).toBe(before)
    expect(warns.filter((w) => w.includes('[cv] başvuru yok sayıldı sebep=honeypot'))).toHaveLength(1)
    expect(warns.filter((w) => w.includes('[cv] başvuru yok sayıldı sebep=fill_too_fast'))).toHaveLength(2)
    expect(warns.join('\n')).not.toMatch(/@example\.com|Test Kullanıcı|203\.0\.113/)
  })

  it('JBIG2/JPX içeren PDF reddedilir: yönlendirici mesaj, kayıt yok, log yalnızca sebep kodu (iç ayrıntı sızmaz)', async () => {
    const warns: string[] = []
    const original = payload.logger.warn.bind(payload.logger)
    payload.logger.warn = ((msg: unknown) => {
      warns.push(String(msg))
      return original(msg as never)
    }) as typeof payload.logger.warn
    const before = await count()
    const results: Awaited<ReturnType<typeof post>>[] = []
    try {
      for (const [i, filter] of (['JBIG2Decode', 'JPXDecode'] as const).entries()) {
        const cv = new File([new Uint8Array(codecPdf(filter))], 'tarama.pdf', { type: 'application/pdf' })
        results.push(await post(buildForm({ email: `codec${i}@example.com`, cv }), { ip: `203.0.113.${54 + i}` }))
      }
    } finally {
      payload.logger.warn = original as typeof payload.logger.warn
    }
    for (const res of results) {
      expect(res.status).toBe(400)
      expect(res.json.code).toBe('scanned_pdf')
      expect(res.json.message).toBe(
        'CV\'niz taranmış veya fotoğraf tabanlı bir biçimde görünüyor. Lütfen CV\'nizi Word, Google Docs veya Canva gibi bir programdan PDF olarak kaydedip yeniden yükleyin.',
      )
      expect(JSON.stringify(res.json)).not.toMatch(/JBIG2|JPX|codec|kodek/i) // kodek adı yanıta sızmaz
    }
    expect(await count()).toBe(before)
    expect(warns.filter((w) => w.includes('[cv] başvuru reddedildi sebep=scanned_pdf'))).toHaveLength(2)
    expect(warns.join('\n')).not.toMatch(/@example\.com|Test Kullanıcı|203\.0\.113|JBIG2|JPX/)
  })

  it('çok büyük süre reddedilmez; eksik veya sayı olmayan süre geçersiz istektir', async () => {
    const before = await count()
    const huge = await post(buildForm({ fillMs: '99999999999999' }), { ip: '203.0.113.53' })
    expect(huge.status).toBe(201)
    expect(await count()).toBe(before + 1) // gerçekten kaydedilir (sessiz red değil)
    for (const fillMs of [null, '', 'abc']) {
      const res = await post(buildForm({ fillMs }), { ip: '203.0.113.54' })
      expect(res.status).toBe(400)
      expect(res.json.code).toBe('invalid_request')
    }
  })

  it('Content-Length yoksa 411, sınırı aşıyorsa 413', async () => {
    expect((await post(buildForm(), { ip: '203.0.113.60', omitLength: true })).status).toBe(411)
    const big = await post(buildForm(), { ip: '203.0.113.61', contentLength: 6 * 1024 * 1024 })
    expect(big.status).toBe(413)
    expect(big.json.code).toBe('too_large')
  })

  it('red türüne göre doğru Türkçe mesaj döner; iç ayrıntı sızmaz', async () => {
    const file = (buf: Buffer) => new File([new Uint8Array(buf)], 'cv.pdf', { type: 'application/pdf' })

    const enc = await post(buildForm({ cv: file(encryptedPdf()) }), { ip: '203.0.113.70' })
    expect(enc.status).toBe(400)
    expect(enc.json.code).toBe('encrypted')
    expect(String(enc.json.message)).toMatch(/parola veya izin korumalı/)

    const emb = await post(buildForm({ cv: file(embeddedPdf()) }), { ip: '203.0.113.71' })
    expect(emb.json.code).toBe('embedded')
    expect(String(emb.json.message)).toMatch(/Hibrit PDF/)

    const act = await post(buildForm({ cv: file(activePdf()) }), { ip: '203.0.113.72' })
    expect(act.status).toBe(400)
    expect(act.json.code).toBe('rejected')
    expect(JSON.stringify(act.json)).not.toMatch(/JS|JavaScript|active|pdf-active-content/)

    const fake = await post(buildForm({ cv: new File(['MZ sahte'], 'cv.pdf', { type: 'application/pdf' }) }), { ip: '203.0.113.73' })
    expect(fake.json.code).toBe('invalid')

    const missing = await post(buildForm({ cv: null }), { ip: '203.0.113.74' })
    expect(missing.json.code).toBe('file_missing')
  })

  it('burst sınırı: aynı IP dakikada 3 denemeden sonra 429', async () => {
    const ip = '203.0.113.80'
    for (let i = 0; i < 3; i++) expect((await post(buildForm({ consent: null }), { ip })).status).toBe(400)
    expect((await post(buildForm(), { ip })).json.code).toBe('rate_limited')
  })

  it('günlük IP sınırı: 24 saatte 15 başvurudan sonra 429', async () => {
    const ip = '203.0.113.90'
    const hash = hashClientIp(ip, testEnv)
    if (!hash.ok) throw new Error('hash')
    const pdf = cleanPdf()
    for (let i = 0; i < 15; i++) {
      await payload.create({
        collection: COLLECTION,
        overrideAccess: true,
        data: {
          candidateName: 'Kampüs Öğrencisi',
          status: 'new',
          email: `kampus-${i}@example.com`,
          experienceLevel: 'intern',
          fieldsOfInterest: ['frontend'],
          consentGiven: true,
          consentAt: new Date().toISOString(),
          consentTextVersion: 'cv-test-1',
          ipHash: hash.hash,
        },
        file: { data: pdf, mimetype: 'application/pdf', name: 'x.pdf', size: pdf.length },
      })
    }
    const res = await post(buildForm(), { ip })
    expect(res.status).toBe(429)
    expect(res.json.code).toBe('rate_limited')
  })

  it('depolama dizini yazılamıyorsa fail-closed 503', async () => {
    fs.chmodSync(storageDir, 0o500)
    try {
      const res = await post(buildForm(), { ip: '203.0.113.100' })
      expect(res.status).toBe(503)
      expect(res.json.code).toBe('misconfigured')
    } finally {
      fs.chmodSync(storageDir, 0o700)
    }
  })

  it('production\'da CV_IP_HASH_SECRET yoksa fail-closed 503', async () => {
    const env = process.env as Record<string, string | undefined>
    const [nodeEnv, secret] = [env.NODE_ENV, env.CV_IP_HASH_SECRET]
    env.NODE_ENV = 'production'
    delete env.CV_IP_HASH_SECRET
    try {
      const res = await post(buildForm(), { ip: '203.0.113.110' })
      expect(res.status).toBe(503)
      expect(res.json.code).toBe('misconfigured')
    } finally {
      env.NODE_ENV = nodeEnv
      env.CV_IP_HASH_SECRET = secret
    }
  })

  it('CV indirme: giriş yoksa 403; girişliyken attachment + nosniff başlıkları ve tek log satırı', async () => {
    const { docs } = await payload.find({ collection: COLLECTION, overrideAccess: true, limit: 1 })
    const doc = docs[0]
    const endpoints = payload.collections[COLLECTION].config.endpoints
    const fileHandler = (Array.isArray(endpoints) ? endpoints : []).find((e) => e.path === '/file/:filename')!.handler
    const download = async (user?: unknown) => {
      const request = new Request(`http://localhost/api/${COLLECTION}/file/${doc.filename}`)
      const req = await createReq(request)
      req.routeParams = { collection: COLLECTION, filename: doc.filename! }
      req.user = (user ?? null) as typeof req.user
      return fileHandler(req)
    }

    // Giriş yapmamış: dosya servisi reddeder (Payload hatayı fırlatır veya 403 döner)
    const anon = await download().then((r) => r.status, (err: { status?: number }) => err.status)
    expect(anon).toBe(403)

    const logs: string[] = []
    const logger = payload.logger
    const original = logger.info.bind(logger)
    ;(logger as { info: unknown }).info = (...args: unknown[]) => {
      logs.push(String(args[0]))
      return original(...(args as Parameters<typeof original>))
    }
    try {
      const res = await download({ id: 'user-1', collection: 'users', email: 'gizli@example.com' })
      expect(res.status).toBe(200)
      expect(res.headers.get('content-disposition')).toBe('attachment')
      expect(res.headers.get('x-content-type-options')).toBe('nosniff')
      expect(res.headers.get('cache-control')).toBe('private, no-store')
      await res.arrayBuffer()
    } finally {
      ;(logger as { info: unknown }).info = original
    }

    const cvLogs = logs.filter((l) => l.startsWith('[cv] indirme'))
    expect(cvLogs).toHaveLength(1)
    expect(cvLogs[0]).toContain('kullanici=user-1')
    expect(cvLogs[0]).toContain(`basvuru=${doc.id}`)
    expect(cvLogs[0]).not.toContain('gizli@example.com')
    expect(cvLogs[0]).not.toContain(doc.filename!)
    expect(cvLogs[0]).not.toContain(doc.candidateName)
    expect(cvLogs[0]).not.toContain(doc.email)
  })

  it('anonim okuma reddedilir; kayıt silinince CV dosyası da silinir', async () => {
    await expect(payload.find({ collection: COLLECTION, overrideAccess: false })).rejects.toThrow()

    const { docs } = await payload.find({ collection: COLLECTION, overrideAccess: true, limit: 1 })
    const file = path.join(storageDir, docs[0].filename!)
    expect(fs.existsSync(file)).toBe(true)
    await payload.delete({ collection: COLLECTION, id: docs[0].id, overrideAccess: true })
    expect(fs.existsSync(file)).toBe(false)
  })
})
