// CV havuzu başvuru formu tipleri ve sabitleri (FAZ 6).
// Sabitler CMS'teki kaynaklarla aynı olmalıdır (paketler birbirini import etmez):
//   alan adları  → localhostusak-cms/src/lib/cv/apply.ts (FORM_FIELDS)
//   seçenekler   → localhostusak-cms/src/lib/cv/options.ts
//   boyut sınırı → localhostusak-cms/src/lib/cv/limits.ts
// Buradaki doğrulama yalnızca kullanıcı deneyimi içindir; asıl doğrulama sunucudadır.

export const MAX_CV_BYTES = 5 * 1024 * 1024 // 5 MB

export const APPLICATION_FIELDS = {
  name: 'candidateName',
  email: 'email',
  phone: 'phone',
  linkedin: 'linkedinUrl',
  github: 'githubUrl',
  level: 'experienceLevel',
  interests: 'fieldsOfInterest',
  consent: 'consent',
  file: 'cv',
  // Anlamsız ad bilerek: otomatik doldurma/parola yöneticileri tanımasın (bkz. CMS FORM_FIELDS)
  honeypot: 'q7zk_x2m',
  fillMs: 'fillMs', // formun açık kaldığı süre (ms); cihaz saatinden bağımsız
} as const

export const EXPERIENCE_LEVELS = [
  { label: 'Stajyer / Öğrenci', value: 'intern' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid', value: 'mid' },
  { label: 'Senior', value: 'senior' },
] as const

export const FIELDS_OF_INTEREST = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'DevOps', value: 'devops' },
  { label: 'UI/UX', value: 'uiux' },
  { label: 'Diğer', value: 'other' },
] as const

// CMS'teki careers-page-settings.applicationForm grubu (hepsi boş/null gelebilir)
export interface ApplicationFormSettings {
  enabled?: boolean | null
  title?: string | null
  intro?: string | null
  privacyNotice?: string | null
  consentText?: string | null
  consentVersion?: string | null
  retentionYears?: number | null
  successMessage?: string | null
}

// Yer tutucuları çözülmüş, forma hazır metinler
export interface ApplicationFormTexts {
  title: string
  intro: string
  privacyParagraphs: string[]
  consentText: string
  successMessage: string
}

export interface ApplicationValues {
  candidateName: string
  email: string
  phone: string
  linkedinUrl: string
  githubUrl: string
  experienceLevel: string
  fieldsOfInterest: string[]
  consent: boolean
  file: File | null
}

// Alan adı → kullanıcıya gösterilen kısa hata (yalnızca istemci doğrulaması)
export type ApplicationErrors = Partial<Record<keyof ApplicationValues, string>>

// Sunucu yanıtı: message olduğu gibi gösterilir; fields sunucunun işaretlediği alan adlarıdır
export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fields: string[] }
