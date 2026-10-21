// @vitest-environment node
// CV yardımcıları için birim testleri. Veritabanına bağlanmaz.
// Test PDF'leri burada elle üretilir; içlerinde gerçek zararlı kod yoktur, yalnızca anahtar kelimeler.
import zlib from 'zlib'
import { describe, expect, it, vi } from 'vitest'

import { CV_FILENAME_RE, cvFilename } from '@/lib/cv/filename'
import {
  MAX_CV_BYTES,
  PDF_MAX_NESTING_DEPTH,
  PDF_OBJECT_MAX_COUNT,
  PDF_OBJECT_WARN_COUNT,
} from '@/lib/cv/limits'
import { DEFAULT_RETENTION_YEARS, resolveRetentionYears, retentionCutoff } from '@/lib/cv/retention'
import { scanCv } from '@/lib/cv/scanner'
import type { CvScanner } from '@/lib/cv/scanners/types'
import { resolveCvStorageDir } from '@/lib/cv/storage'
import { getClientIp, hashClientIp } from '@/lib/http/clientIp'
import { createRateLimiter } from '@/lib/http/rateLimit'

import {
  activePdf,
  buildPdf,
  cleanObjects,
  cleanPdf,
  codecPdf,
  deepNestingPdf,
  embeddedPdf,
  encryptedPdf,
  manyObjectsPdf,
  streamObj,
} from '../helpers/pdf'

// --- scanCv ------------------------------------------------------------------

describe('scanCv', () => {
  it('temiz PDF kabul edilir (link, metadata ve ikili içerikteki /JS yanlış pozitif üretmez)', async () => {
    const result = await scanCv(cleanPdf())
    expect(result).toEqual({ ok: true, code: 'clean', engines: ['pdf-active-content'], warnings: [], reasons: [] })
  })

  it('/OpenAction ile gömülü JavaScript reddedilir', async () => {
    const result = await scanCv(activePdf())
    expect(result.ok).toBe(false)
    expect(result.code).toBe('active')
    expect(result.reasons.join(' ')).toMatch(/\/JS|\/JavaScript/)
  })

  it('#xx kodlamasıyla gizlenmiş anahtar reddedilir', async () => {
    const objects = cleanObjects('/OpenAction 7 0 R')
    objects.push('<< /S /J#61vaScript /J#53 (x) >>')
    expect((await scanCv(buildPdf(objects))).code).toBe('active')
  })

  it('sıkıştırılmış nesne akışında (ObjStm) gizlenmiş JS reddedilir', async () => {
    const inner = Buffer.from('8 0 << /S /JavaScript /JS (x) >>', 'latin1')
    const objects = cleanObjects()
    objects.push(streamObj('/Type /ObjStm /N 1 /First 4 /Filter /FlateDecode', zlib.deflateSync(inner)))
    const result = await scanCv(buildPdf(objects))
    expect(result.code).toBe('active')
  })

  it('/Launch → active, gömülü dosya → embedded', async () => {
    const launch = cleanObjects()
    launch.push('<< /S /Launch /F (cmd.exe) >>')
    expect((await scanCv(buildPdf(launch))).code).toBe('active')
    expect((await scanCv(embeddedPdf())).code).toBe('embedded')
  })

  it('şifreli (izin kısıtlı/parolalı) PDF → encrypted; aktif içerik varsa active önceliklidir', async () => {
    expect((await scanCv(encryptedPdf())).code).toBe('encrypted')
    const both = buildPdf([...cleanObjects('/OpenAction 8 0 R'), '<< /Filter /Standard /V 2 >>', '<< /S /Launch >>'], '/Encrypt 7 0 R')
    expect((await scanCv(both)).code).toBe('active')
  })

  it('bozuk PDF reddedilir: kesik dosya, sahte uzantı, açılamayan nesne akışı', async () => {
    const pdf = cleanPdf()
    expect((await scanCv(pdf.subarray(0, Math.floor(pdf.length / 2)))).code).toBe('invalid')
    expect((await scanCv(Buffer.from('MZ\x90\x00 gerçek bir PDF değil', 'latin1'))).code).toBe('invalid')

    const broken = cleanObjects()
    broken.push(streamObj('/Type /ObjStm /N 1 /First 4 /Filter /FlateDecode', Buffer.from('bozuk-zlib-verisi')))
    const result = await scanCv(buildPdf(broken))
    expect(result.code).toBe('invalid')
    expect(result.reasons[0]).toMatch(/ayrıştırma hatası/)
  })

  it('denetlenemeyen filtreli nesne akışı reddedilir', async () => {
    const objects = cleanObjects()
    objects.push(streamObj('/Type /ObjStm /N 1 /First 4 /Filter [/ASCII85Decode /FlateDecode]', Buffer.from('xx')))
    expect((await scanCv(buildPdf(objects))).code).toBe('invalid')
  })

  it('zip-bomb benzeri aşırı büyük açılım reddedilir', async () => {
    const objects = cleanObjects()
    const bomb = zlib.deflateSync(Buffer.alloc(25 * 1024 * 1024)) // ~25 KB sıkıştırılmış, 25 MB açılır
    objects.push(streamObj('/Type /ObjStm /N 1 /First 4 /Filter /FlateDecode', bomb))
    expect((await scanCv(buildPdf(objects))).code).toBe('invalid')
  })

  it('boyut sınırı (5 MB) aşılırsa ve boş dosyada reddedilir', async () => {
    const pdf = cleanPdf()
    const oversized = Buffer.concat([pdf, Buffer.alloc(MAX_CV_BYTES + 1 - pdf.length)])
    expect(oversized.length).toBe(MAX_CV_BYTES + 1)
    expect((await scanCv(oversized)).code).toBe('too_large')
    expect((await scanCv(Buffer.alloc(0))).code).toBe('invalid')
  })

  it('fail-closed: tarayıcı hatası, zaman aşımı ve boş tarayıcı listesi reddedilir', async () => {
    const throwing: CvScanner = { name: 'hatali', scan: async () => Promise.reject(new Error('motor çöktü')) }
    const hanging: CvScanner = { name: 'askida', scan: () => new Promise<never>(() => {}) }
    expect((await scanCv(cleanPdf(), { scanners: [throwing] })).code).toBe('scan_error')
    const timedOut = await scanCv(cleanPdf(), { scanners: [hanging], timeoutMs: 50 })
    expect(timedOut.code).toBe('scan_error')
    expect(timedOut.reasons[0]).toMatch(/zaman aşımı/)
    expect((await scanCv(cleanPdf(), { scanners: [] })).code).toBe('scan_error')
  })

  it('tarayıcı listesi genişletilebilir: hepsi temiz demeli', async () => {
    const dirty: CvScanner = { name: 'ek-motor', scan: async () => ({ ok: false, code: 'active', reasons: ['imza eşleşti'] }) }
    const result = await scanCv(cleanPdf(), { scanners: [...(await import('@/lib/cv/scanners')).defaultScanners, dirty] })
    expect(result).toEqual({
      ok: false,
      code: 'active',
      engines: ['pdf-active-content', 'ek-motor'],
      warnings: [],
      reasons: ['ek-motor: imza eşleşti'],
    })
  })

  it('JBIG2 / JPX: scanned_pdf ile reddedilir; temiz PDF ve diğer kontroller etkilenmez', async () => {
    for (const filter of ['JBIG2Decode', 'JPXDecode'] as const) {
      const result = await scanCv(codecPdf(filter))
      expect(result).toMatchObject({ ok: false, code: 'scanned_pdf' })
    }
    // "#" kodlamalı gizlenmiş isim de yakalanır
    const hidden = Buffer.from(codecPdf('JPXDecode').toString('latin1').replace('/JPXDecode', '/JPX#44ecode'), 'latin1')
    expect((await scanCv(hidden)).code).toBe('scanned_pdf')
    // Temiz PDF kabul edilir, uyarı üretmez
    expect(await scanCv(cleanPdf())).toMatchObject({ ok: true, warnings: [] })
  })

  it('JBIG2 / JPX: sabit "warn" yapılırsa reddetmez, yalnızca uyarı verir', async () => {
    vi.resetModules()
    vi.doMock('@/lib/cv/limits', async (importOriginal) => ({
      ...(await importOriginal<typeof import('@/lib/cv/limits')>()),
      PDF_RISKY_CODEC_ACTION: 'warn',
    }))
    try {
      const { scanCv: lenientScanCv } = await import('@/lib/cv/scanner')
      expect(await lenientScanCv(codecPdf('JBIG2Decode'))).toMatchObject({ ok: true, warnings: ['jbig2'] })
      expect(await lenientScanCv(codecPdf('JPXDecode'))).toMatchObject({ ok: true, warnings: ['jpx'] })
    } finally {
      vi.doUnmock('@/lib/cv/limits')
      vi.resetModules()
    }
  })

  it('red önceliği: active/encrypted/embedded, scanned_pdf\'ten önce gelir', async () => {
    const activeWithCodec = buildPdf([
      ...cleanObjects('/OpenAction 7 0 R'),
      '<< /S /JavaScript /JS (x) >>',
      '<< /Filter /JBIG2Decode >>',
    ])
    expect((await scanCv(activeWithCodec)).code).toBe('active')
    const embeddedWithCodec = buildPdf([
      ...cleanObjects('/Names << /EmbeddedFiles 7 0 R >>'),
      '<< /Filter /JPXDecode >>',
    ])
    expect((await scanCv(embeddedWithCodec)).code).toBe('embedded')
  })

  it('nesne sayısı: log eşiğinde uyarı, red eşiğinde invalid', async () => {
    expect((await scanCv(manyObjectsPdf(PDF_OBJECT_WARN_COUNT))).warnings).toEqual([])
    expect(await scanCv(manyObjectsPdf(PDF_OBJECT_WARN_COUNT + 1))).toMatchObject({
      ok: true,
      warnings: ['many_objects'],
    })
    expect((await scanCv(manyObjectsPdf(PDF_OBJECT_MAX_COUNT))).ok).toBe(true)
    const over = await scanCv(manyObjectsPdf(PDF_OBJECT_MAX_COUNT + 1))
    expect(over).toMatchObject({ ok: false, code: 'invalid' })
    expect(over.reasons[0]).toMatch(/nesne sayısı/)
  })

  it('nesne sayısı: nesne akışının bildirdiği /N sayılır, /Size sayılmaz', async () => {
    const objStm = streamObj(`/Type /ObjStm /N ${PDF_OBJECT_MAX_COUNT} /First 0`, Buffer.from('<< >>'))
    expect(await scanCv(buildPdf([...cleanObjects(), objStm]))).toMatchObject({ ok: false, code: 'invalid' })
    const hugeSize = buildPdf(cleanObjects(), '/Info 6 0 R').toString('latin1').replace('/Size 7', '/Size 999999')
    expect((await scanCv(Buffer.from(hugeSize, 'latin1'))).ok).toBe(true)
  })

  it('iç içe derinlik: sınırda geçer, aşılınca invalid', async () => {
    expect((await scanCv(deepNestingPdf(PDF_MAX_NESTING_DEPTH))).ok).toBe(true)
    const over = await scanCv(deepNestingPdf(PDF_MAX_NESTING_DEPTH + 1))
    expect(over).toMatchObject({ ok: false, code: 'invalid' })
    expect(over.reasons[0]).toMatch(/derinlik/)
    // Metin içindeki parantezler derinliğe sayılmaz
    const inText = buildPdf([...cleanObjects(), `<< /T (${'['.repeat(100)}) >>`], '/Info 6 0 R')
    expect((await scanCv(inText)).ok).toBe(true)
  })

  it('red önceliği: active/encrypted/embedded, sınır ve uyarılardan önce gelir', async () => {
    const manyActive = buildPdf([
      ...cleanObjects('/OpenAction 7 0 R'),
      '<< /S /JavaScript /JS (x) >>',
      ...Array.from({ length: PDF_OBJECT_MAX_COUNT }, () => '<< >>'),
    ])
    expect((await scanCv(manyActive)).code).toBe('active')
    const deepEmbedded = buildPdf([
      ...cleanObjects('/Names << /EmbeddedFiles 7 0 R >>'),
      `${'['.repeat(PDF_MAX_NESTING_DEPTH + 1)}${']'.repeat(PDF_MAX_NESTING_DEPTH + 1)}`,
    ])
    expect((await scanCv(deepEmbedded)).code).toBe('embedded')
  })
})

// --- Dosya adı -----------------------------------------------------------------

describe('cvFilename', () => {
  it('rastgele ve aday adından bağımsız ad üretir', () => {
    const names = new Set(Array.from({ length: 200 }, () => cvFilename()))
    expect(names.size).toBe(200)
    for (const name of names) {
      expect(name).toMatch(CV_FILENAME_RE)
      expect(name.toLowerCase()).not.toMatch(/ahmet|yilmaz|cv\.pdf$/)
    }
    expect(cvFilename(new Date('2026-10-05T00:00:00Z'))).toMatch(/_1791158400\.pdf$/)
  })
})

// --- Rate limit -------------------------------------------------------------------

describe('createRateLimiter', () => {
  it('pencere içinde sınırı uygular, pencere bitince serbest bırakır', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3 })
    const t0 = 1_000_000
    expect([0, 1, 2].map((i) => limiter.check('ip', t0 + i).allowed)).toEqual([true, true, true])
    const blocked = limiter.check('ip', t0 + 10)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterMs).toBeGreaterThan(0)
    expect(limiter.check('baska-ip', t0 + 10).allowed).toBe(true)
    expect(limiter.check('ip', t0 + 60_001).allowed).toBe(true)
  })

  it('anahtar sayısı sınırı aşılınca süresi geçenleri temizler', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1, maxKeys: 10 })
    for (let i = 0; i < 20; i++) limiter.check(`k${i}`, 0)
    limiter.check('yeni', 5000)
    expect(limiter.size()).toBe(1)
  })
})

// --- IP ve HMAC -----------------------------------------------------------------------

describe('getClientIp / hashClientIp', () => {
  it('x-forwarded-for listesinin son (proxy tarafından eklenen) değerini alır', () => {
    expect(getClientIp(new Headers({ 'x-forwarded-for': '6.6.6.6, 203.0.113.7' }))).toBe('203.0.113.7')
    expect(getClientIp(new Headers({ 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2')
    expect(getClientIp(new Headers())).toBeNull()
  })

  it('HMAC: ham IP içermez, anahtara bağlıdır; production\'da anahtar yoksa reddeder', () => {
    const a = hashClientIp('203.0.113.7', { NODE_ENV: 'production', CV_IP_HASH_SECRET: 'gizli-1' } as NodeJS.ProcessEnv)
    const b = hashClientIp('203.0.113.7', { NODE_ENV: 'production', CV_IP_HASH_SECRET: 'gizli-2' } as NodeJS.ProcessEnv)
    expect(a.ok && b.ok).toBe(true)
    if (a.ok && b.ok) {
      expect(a.hash).toMatch(/^[0-9a-f]{64}$/)
      expect(a.hash).not.toContain('203.0.113.7')
      expect(a.hash).not.toBe(b.hash)
    }
    expect(hashClientIp('203.0.113.7', { NODE_ENV: 'production' } as NodeJS.ProcessEnv)).toEqual({
      ok: false,
      reason: 'CV_IP_HASH_SECRET tanımlı değil',
    })
    expect(hashClientIp('203.0.113.7', { NODE_ENV: 'development' } as NodeJS.ProcessEnv).ok).toBe(true)
  })
})

// --- Depolama dizini ------------------------------------------------------------------

describe('resolveCvStorageDir', () => {
  it('production\'da yerel varsayılana düşmez', () => {
    const env = (e: Record<string, string>) => e as NodeJS.ProcessEnv
    expect(resolveCvStorageDir(env({ NODE_ENV: 'production' })).ok).toBe(false)
    expect(resolveCvStorageDir(env({ NODE_ENV: 'production', CV_STORAGE_DIR: 'goreli/yol' })).ok).toBe(false)
    expect(resolveCvStorageDir(env({ NODE_ENV: 'production', CV_STORAGE_DIR: '/data/cv' }))).toEqual({ ok: true, dir: '/data/cv' })
    expect(resolveCvStorageDir(env({ NODE_ENV: 'development' }))).toEqual({ ok: true, dir: 'cv-applications' })
  })
})

// --- Saklama süresi ------------------------------------------------------------------

describe('saklama süresi', () => {
  it('geçersiz/boş değer varsayılan 2 yıla düşer', () => {
    expect(DEFAULT_RETENTION_YEARS).toBe(2)
    for (const v of [undefined, null, '', '3', 0, -1, 1.5, 11, Number.NaN]) {
      expect(resolveRetentionYears(v)).toBe(2)
    }
    expect(resolveRetentionYears(1)).toBe(1)
    expect(resolveRetentionYears(5)).toBe(5)
  })

  it('kesim tarihi şimdiden N yıl öncedir', () => {
    const now = new Date('2026-10-05T12:00:00.000Z')
    expect(retentionCutoff(2, now).toISOString()).toBe('2024-10-05T12:00:00.000Z')
    expect(now.toISOString()).toBe('2026-10-05T12:00:00.000Z') // girdi değişmez
  })
})
