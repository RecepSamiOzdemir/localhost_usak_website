import {
  EXPERIENCE_LEVELS,
  FIELDS_OF_INTEREST,
  MAX_CV_BYTES,
  type ApplicationErrors,
  type ApplicationFormSettings,
  type ApplicationFormTexts,
  type ApplicationValues,
} from '../types/application'

const FALLBACK_TITLE = 'CV Havuzuna Katıl'
const FALLBACK_SUCCESS = 'Başvurunuz alındı. Teşekkür ederiz.'

// {{ad}} biçimindeki yer tutucular; içerik değişince lastIndex karışmasın diye her çağrıda yeni RegExp
const placeholderPattern = () => /\{\{\s*([^{}]*?)\s*\}\}/g

export type ResolveResult =
  | { ok: true; texts: ApplicationFormTexts }
  | { ok: false; unresolved: string[] }

// Bilinen yer tutucuları gerçek değerle değiştirir. Değiştirilemeyen bir yer tutucu kalırsa
// (bilinmeyen ad, eksik/geçersiz değer) form gösterilmemelidir; bu fonksiyon o durumda ok:false döner.
// Gerekli metinler (aydınlatma, rıza) boşsa da ok:false: rıza metni olmadan form açılmaz.
export function resolveApplicationTexts(settings: ApplicationFormSettings): ResolveResult {
  const values: Record<string, string> = {}
  const years = settings.retentionYears
  if (typeof years === 'number' && Number.isInteger(years) && years > 0) {
    values.retentionYears = String(years)
  }

  const unresolved = new Set<string>()
  const fill = (raw: string | null | undefined): string => {
    const source = typeof raw === 'string' ? raw.trim() : ''
    return source.replace(placeholderPattern(), (match, name: string) => {
      if (Object.prototype.hasOwnProperty.call(values, name)) return values[name]
      unresolved.add(match)
      return match
    })
  }

  const title = fill(settings.title) || FALLBACK_TITLE
  const intro = fill(settings.intro)
  const privacyNotice = fill(settings.privacyNotice)
  const consentText = fill(settings.consentText)
  const successMessage = fill(settings.successMessage) || FALLBACK_SUCCESS

  if (!privacyNotice) unresolved.add('<privacyNotice boş>')
  if (!consentText) unresolved.add('<consentText boş>')
  if (unresolved.size > 0) return { ok: false, unresolved: [...unresolved] }

  return {
    ok: true,
    texts: {
      title,
      intro,
      privacyParagraphs: privacyNotice.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
      consentText,
      successMessage,
    },
  }
}

// Sunucudaki (apply.ts) kurallarla aynı; yalnızca kullanıcı deneyimi için
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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Dosya türü/boyutu kontrolü. Bazı sistemler PDF için boş MIME verir; bu yüzden uzantıya da bakılır.
export function checkCvFile(file: File): string | null {
  const looksLikePdf = file.type === 'application/pdf' || (!file.type && /\.pdf$/i.test(file.name))
  if (!looksLikePdf) return 'Yalnızca PDF dosyası yükleyebilirsiniz.'
  if (file.size === 0) return 'Seçtiğiniz dosya boş.'
  if (file.size > MAX_CV_BYTES) return `CV dosyası en fazla 5 MB olabilir (seçtiğiniz dosya ${formatFileSize(file.size)}).`
  return null
}

export function validateApplication(values: ApplicationValues): ApplicationErrors {
  const errors: ApplicationErrors = {}

  const name = values.candidateName.trim()
  if (name.length < 2 || name.length > 120) errors.candidateName = 'Ad soyad 2–120 karakter olmalıdır.'

  const email = values.email.trim()
  if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Geçerli bir e-posta adresi girin.'

  const phone = values.phone.trim()
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Telefon numarası yalnızca rakam, +, boşluk, tire ve parantez içerebilir.'

  const linkedin = values.linkedinUrl.trim()
  if (linkedin && !isHttpsUrl(linkedin)) errors.linkedinUrl = 'https:// ile başlayan geçerli bir bağlantı girin.'

  const github = values.githubUrl.trim()
  if (github && !isHttpsUrl(github)) errors.githubUrl = 'https:// ile başlayan geçerli bir bağlantı girin.'

  if (!EXPERIENCE_LEVELS.some((o) => o.value === values.experienceLevel)) {
    errors.experienceLevel = 'Deneyim seviyenizi seçin.'
  }

  const interests = values.fieldsOfInterest.filter((v) => FIELDS_OF_INTEREST.some((o) => o.value === v))
  if (interests.length === 0) errors.fieldsOfInterest = 'En az bir ilgi alanı seçin.'

  if (!values.file) errors.file = 'Lütfen CV\'nizi PDF olarak ekleyin.'
  else {
    const fileError = checkCvFile(values.file)
    if (fileError) errors.file = fileError
  }

  if (!values.consent) errors.consent = 'Başvuru için açık rıza onayı gereklidir.'

  return errors
}
