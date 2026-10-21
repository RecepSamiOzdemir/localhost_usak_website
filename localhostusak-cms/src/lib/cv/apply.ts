import path from 'path'
import { ValidationError, type PayloadHandler, type PayloadRequest } from 'payload'

import { getClientIp, hashClientIp } from '../http/clientIp'
import { createRateLimiter } from '../http/rateLimit'
import { MAX_CV_BYTES } from './limits'
import { EXPERIENCE_LEVELS, FIELDS_OF_INTEREST } from './options'
import { scanCv } from './scanner'
import { ensureWritableDir, resolveCvStorageDir } from './storage'

// POST /api/job-applications/apply — herkese açık CV başvurusu (FAZ 6).
// Sıra: bayrak → yapılandırma → Content-Length → gövde → honeypot/süre → burst → alanlar/rıza
//       → günlük IP/e-posta sınırı → PDF doğrulama + tarama → kayıt (overrideAccess).
// Loglara ad, e-posta, IP veya dosya adı yazılmaz; yalnızca başvuru id'si ve sebep kodu.

const COLLECTION = 'job-applications'
const SETTINGS_GLOBAL = 'careers-page-settings'

export const DAILY_IP_LIMIT = 15 // Kampüs/CGNAT ortak IP'leri gözetilerek
export const DAILY_EMAIL_LIMIT = 1
const DAY_MS = 24 * 60 * 60 * 1000
// Çok parçalı gövde ek yükü (alanlar + sınırlar) için pay
const MULTIPART_OVERHEAD_BYTES = 256 * 1024
// Formun açılışından gönderime kadar geçmesi gereken en kısa süre (bot koruması)
const MIN_FILL_MS = 3000

// Bellek içi burst sınırı: redeploy'da sıfırlanır (bilinen ve kabul edilen sınır)
const burstLimiter = createRateLimiter({ windowMs: 60_000, max: 3 })

// Formdan kabul edilen alan adları (whitelist). Diğer her alan yok sayılır.
export const FORM_FIELDS = {
  name: 'candidateName',
  email: 'email',
  phone: 'phone',
  linkedin: 'linkedinUrl',
  github: 'githubUrl',
  level: 'experienceLevel',
  interests: 'fieldsOfInterest',
  consent: 'consent',
  file: 'cv',
  // Gizli alan: insan kullanıcı doldurmaz. Ad bilerek anlamsız: tarayıcı otomatik doldurması ve
  // parola yöneticileri "website", "url" gibi adlara bakıp alanı doldurup meşru başvuruyu kaybettirebilir.
  honeypot: 'q7zk_x2m',
  // Formun açık kaldığı süre (ms, istemcide performance.now() farkı). Cihaz saatine bağlı değildir.
  fillMs: 'fillMs',
} as const

type RejectCode =
  | 'disabled'
  | 'misconfigured'
  | 'length_required'
  | 'too_large'
  | 'invalid_request'
  | 'rate_limited'
  | 'validation'
  | 'consent_missing'
  | 'file_missing'
  | 'invalid'
  | 'encrypted'
  | 'embedded'
  | 'scanned_pdf'
  | 'rejected'
  | 'server_error'

const GENERIC_REJECT =
  'Dosya güvenlik kontrolünden geçemedi. CV\'nizi yeniden PDF olarak kaydedip tekrar deneyin.'

// Kullanıcıya dönen mesajlar. İç ayrıntı (tetiklenen kural, yol, motor) asla dönmez.
const MESSAGES: Record<RejectCode, string> = {
  disabled: 'Başvurular şu anda kapalı.',
  misconfigured: 'Başvurular geçici olarak alınamıyor. Lütfen daha sonra tekrar deneyin.',
  length_required: 'İstek geçersiz.',
  too_large: 'CV dosyası en fazla 5 MB olabilir.',
  invalid_request: 'İstek geçersiz. Sayfayı yenileyip tekrar deneyin.',
  // Aynı mesaj hem IP hem e-posta sınırı için: bir e-postayla başvuru yapılıp yapılmadığı sızmasın
  rate_limited: 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.',
  validation: 'Lütfen işaretli alanları kontrol edin.',
  consent_missing: 'Başvuru için KVKK açık rıza onayı gereklidir.',
  file_missing: 'Lütfen CV\'nizi PDF olarak ekleyin.',
  invalid: GENERIC_REJECT,
  encrypted:
    'PDF\'iniz parola veya izin korumalı. CV\'nizi oluşturduğunuz programdan (Word, Google Docs, Canva vb.) korumasız olarak yeniden PDF\'e aktarıp tekrar yükleyin.',
  embedded:
    'PDF\'inizin içinde başka bir dosya gömülü. LibreOffice kullanıyorsanız Dışa Aktar → PDF ekranında \'Hibrit PDF (ODF dosyasını göm)\' seçeneğini kapatıp yeniden kaydedin.',
  // JBIG2/JPX (PDF_RISKY_CODEC_ACTION='reject'). Kodek adı kullanıcıya sızmaz.
  scanned_pdf:
    'CV\'niz taranmış veya fotoğraf tabanlı bir biçimde görünüyor. Lütfen CV\'nizi Word, Google Docs veya Canva gibi bir programdan PDF olarak kaydedip yeniden yükleyin.',
  rejected: GENERIC_REJECT,
  server_error: 'Başvurunuz şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin.',
}

const STATUS: Record<RejectCode, number> = {
  disabled: 503,
  misconfigured: 503,
  length_required: 411,
  too_large: 413,
  invalid_request: 400,
  rate_limited: 429,
  validation: 400,
  consent_missing: 400,
  file_missing: 400,
  invalid: 400,
  encrypted: 400,
  embedded: 400,
  scanned_pdf: 400,
  rejected: 400,
  server_error: 500,
}

// logCode: loga yazılan iç sebep; yanıttaki kod kullanıcıya açık olandır (active → rejected gibi)
function reject(req: PayloadRequest, code: RejectCode, logCode: string = code, fields?: string[]): Response {
  const level = STATUS[code] >= 500 ? 'error' : 'warn'
  req.payload.logger[level](`[cv] başvuru reddedildi sebep=${logCode}`)
  return Response.json(
    { success: false, code, message: MESSAGES[code], ...(fields ? { fields } : {}) },
    { status: STATUS[code] },
  )
}

// Reddedilmeyen tarama sinyallerini loglar: "[cv] basvuru=<id> uyari=jbig2,jpx". Kişisel veri yok.
function logScanWarnings(req: PayloadRequest, warnings: readonly string[], id?: number | string): void {
  if (warnings.length === 0) return
  req.payload.logger.warn(`[cv] ${id === undefined ? '' : `basvuru=${id} `}uyari=${warnings.join(',')}`)
}

const text = (form: FormData, key: string): string => {
  const value = form.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+()\s-]{7,30}$/

function isHttpsUrl(value: string): boolean {
  if (value.length > 300) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

type ValidatedFields = {
  candidateName: string
  email: string
  phone?: string
  linkedinUrl?: string
  githubUrl?: string
  experienceLevel: (typeof EXPERIENCE_LEVELS)[number]['value']
  fieldsOfInterest: (typeof FIELDS_OF_INTEREST)[number]['value'][]
}

// Yalnızca whitelist'teki alanlar okunur; status, notes, scanEngines, ipHash vb. istekten asla alınmaz.
function validateFields(form: FormData): { ok: true; data: ValidatedFields } | { ok: false; fields: string[] } {
  const invalid: string[] = []

  const candidateName = text(form, FORM_FIELDS.name)
  if (candidateName.length < 2 || candidateName.length > 120) invalid.push(FORM_FIELDS.name)

  const email = text(form, FORM_FIELDS.email).toLowerCase()
  if (email.length > 254 || !EMAIL_RE.test(email)) invalid.push(FORM_FIELDS.email)

  const phone = text(form, FORM_FIELDS.phone)
  if (phone && !PHONE_RE.test(phone)) invalid.push(FORM_FIELDS.phone)

  const linkedinUrl = text(form, FORM_FIELDS.linkedin)
  if (linkedinUrl && !isHttpsUrl(linkedinUrl)) invalid.push(FORM_FIELDS.linkedin)

  const githubUrl = text(form, FORM_FIELDS.github)
  if (githubUrl && !isHttpsUrl(githubUrl)) invalid.push(FORM_FIELDS.github)

  const level = text(form, FORM_FIELDS.level)
  const experienceLevel = EXPERIENCE_LEVELS.find((o) => o.value === level)?.value
  if (!experienceLevel) invalid.push(FORM_FIELDS.level)

  const rawInterests = form.getAll(FORM_FIELDS.interests).filter((v): v is string => typeof v === 'string')
  const fieldsOfInterest = FIELDS_OF_INTEREST.map((o) => o.value).filter((v) => rawInterests.includes(v))
  if (fieldsOfInterest.length === 0 || rawInterests.length > FIELDS_OF_INTEREST.length) {
    invalid.push(FORM_FIELDS.interests)
  }

  if (invalid.length > 0 || !experienceLevel) return { ok: false, fields: invalid }
  return {
    ok: true,
    data: {
      candidateName,
      email,
      experienceLevel,
      fieldsOfInterest,
      ...(phone ? { phone } : {}),
      ...(linkedinUrl ? { linkedinUrl } : {}),
      ...(githubUrl ? { githubUrl } : {}),
    },
  }
}

export const applyHandler: PayloadHandler = async (req) => {
  const { payload } = req

  // 1. Özellik bayrağı: kapalıysa hiçbir şey okunmaz/yazılmaz
  const settings = await payload.findGlobal({ slug: SETTINGS_GLOBAL, depth: 0 })
  const formSettings = (settings as { applicationForm?: { enabled?: boolean | null; consentVersion?: string | null } })
    .applicationForm
  if (!formSettings?.enabled) return reject(req, 'disabled')

  // 2. Yapılandırma (fail-closed): rıza sürümü, depolama dizini, IP özet anahtarı
  const consentTextVersion = formSettings.consentVersion?.trim()
  if (!consentTextVersion) return reject(req, 'misconfigured', 'consent_version_missing')

  if (!resolveCvStorageDir().ok) return reject(req, 'misconfigured', 'storage_unconfigured')
  const uploadConfig = payload.collections[COLLECTION].config.upload
  if (!uploadConfig || uploadConfig.disableLocalStorage || !uploadConfig.staticDir) {
    return reject(req, 'misconfigured', 'storage_unconfigured')
  }
  const writable = await ensureWritableDir(path.resolve(uploadConfig.staticDir))
  if (!writable.ok) return reject(req, 'misconfigured', 'storage_unwritable')

  const clientIp = getClientIp(req.headers)
  if (!clientIp) payload.logger.warn('[cv] istemci IP okunamadı sebep=ip_unknown')
  // IP okunamazsa ortak "unknown" kovası kullanılır (sınır daha sıkı işler, gevşemez)
  const ipHash = hashClientIp(clientIp ?? 'unknown')
  if (!ipHash.ok) return reject(req, 'misconfigured', 'ip_hash_unconfigured')

  // 3. Content-Length ön kontrolü: gövde okunmadan büyük istekleri reddet
  const contentLength = Number(req.headers.get('content-length'))
  if (!req.headers.get('content-length') || !Number.isFinite(contentLength)) return reject(req, 'length_required')
  if (contentLength > MAX_CV_BYTES + MULTIPART_OVERHEAD_BYTES) return reject(req, 'too_large')

  // 4. Gövde: Payload'ın _payload/client-upload yolları yerine yalnızca standart multipart okunur
  let form: FormData
  try {
    if (typeof req.formData !== 'function') return reject(req, 'invalid_request')
    form = await req.formData()
  } catch {
    return reject(req, 'invalid_request')
  }

  // 5. Honeypot ve minimum doldurma süresi: botlara başarı gibi görünür, hiçbir şey kaydedilmez.
  // Süre istemcinin bildirdiği "form açık kaldı" değeridir (saat kaymasından etkilenmez); eksik/sayı olmayan
  // değer geçersiz istektir. Negatif ve çok büyük değerler reddedilmez: yalnızca MIN_FILL_MS altı sessiz ele alınır.
  const rawFill = text(form, FORM_FIELDS.fillMs)
  const fillMs = Number(rawFill)
  if (rawFill === '' || !Number.isFinite(fillMs)) return reject(req, 'invalid_request')
  const honeypotFilled = Boolean(text(form, FORM_FIELDS.honeypot))
  if (honeypotFilled || fillMs < MIN_FILL_MS) {
    // Tek satır, yalnızca sebep kodu (kişisel veri yok)
    payload.logger.warn(`[cv] başvuru yok sayıldı sebep=${honeypotFilled ? 'honeypot' : 'fill_too_fast'}`)
    return Response.json({ success: true }, { status: 201 })
  }

  // 6. Burst sınırı (bellek içi, dakikada 3)
  if (!burstLimiter.check(ipHash.hash).allowed) return reject(req, 'rate_limited', 'burst_limit')

  // 7. Alanlar ve KVKK rızası
  const validated = validateFields(form)
  if (!validated.ok) return reject(req, 'validation', 'validation', validated.fields)
  if (text(form, FORM_FIELDS.consent) !== 'true') return reject(req, 'consent_missing')

  // 8. Günlük sınırlar (veritabanından; redeploy'da sıfırlanmaz)
  const since = new Date(Date.now() - DAY_MS).toISOString()
  const [ipCount, emailCount] = await Promise.all([
    payload.count({
      collection: COLLECTION,
      where: { and: [{ ipHash: { equals: ipHash.hash } }, { createdAt: { greater_than: since } }] },
      overrideAccess: true,
    }),
    payload.count({
      collection: COLLECTION,
      where: { and: [{ email: { equals: validated.data.email } }, { createdAt: { greater_than: since } }] },
      overrideAccess: true,
    }),
  ])
  if (ipCount.totalDocs >= DAILY_IP_LIMIT) return reject(req, 'rate_limited', 'daily_ip_limit')
  if (emailCount.totalDocs >= DAILY_EMAIL_LIMIT) return reject(req, 'rate_limited', 'daily_email_limit')

  // 9. Dosya: varlık, boyut, PDF yapısı ve aktif içerik taraması (fail-closed)
  const upload = form.get(FORM_FIELDS.file)
  if (!upload || typeof upload === 'string') return reject(req, 'file_missing')
  if (upload.size > MAX_CV_BYTES) return reject(req, 'too_large')
  const buffer = Buffer.from(await upload.arrayBuffer())

  const scan = await scanCv(buffer)
  if (!scan.ok) {
    switch (scan.code) {
      case 'encrypted':
      case 'embedded':
      case 'invalid':
      case 'scanned_pdf':
      case 'too_large':
        return reject(req, scan.code)
      default:
        // active / scan_error: kullanıcıya genel mesaj, loga yalnızca kod
        return reject(req, 'rejected', scan.code)
    }
  }

  // 10. Kayıt: yalnızca doğrulanmış alanlar + sunucuda üretilen alanlar
  try {
    const doc = await payload.create({
      collection: COLLECTION,
      overrideAccess: true,
      depth: 0,
      data: {
        ...validated.data,
        status: 'new',
        consentGiven: true,
        consentAt: new Date().toISOString(),
        consentTextVersion,
        scanEngines: scan.engines.join(','),
        ipHash: ipHash.hash,
      },
      // Ad, beforeOperation hook'unda rastgele adla değiştirilir
      file: { data: buffer, mimetype: 'application/pdf', name: 'cv.pdf', size: buffer.length },
    })
    payload.logger.info(`[cv] başvuru kaydedildi id=${doc.id}`)
    logScanWarnings(req, scan.warnings, doc.id)
    return Response.json({ success: true }, { status: 201 })
  } catch (error) {
    // Payload'ın kendi PDF doğrulaması (validatePDF) da burada devreye girer
    // Kayıt oluşmadı: başvuru id'si yok, uyarı yalnızca sebep koduyla loglanır
    logScanWarnings(req, scan.warnings)
    if (error instanceof ValidationError) return reject(req, 'invalid', 'payload_validation')
    return reject(req, 'server_error', 'create_failed')
  }
}
