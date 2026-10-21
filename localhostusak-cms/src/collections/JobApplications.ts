import { APIError, type CollectionConfig } from 'payload'

import { applyHandler } from '../lib/cv/apply'
import { hardenCvResponseHeaders, logCvDownload } from '../lib/cv/download'
import { cvFilename } from '../lib/cv/filename'
import { MAX_CV_BYTES } from '../lib/cv/limits'
import { EXPERIENCE_LEVELS, FIELDS_OF_INTEREST } from '../lib/cv/options'
import { resolveCvStorageDir } from '../lib/cv/storage'

// FAZ 6 — Kariyer / CV havuzu başvuruları.
// Başvuru kaydı ve CV dosyası aynı belgededir (tek koleksiyon, upload: true).
// Kayıtlar ve dosyalar yalnızca CMS'e giriş yapmış kullanıcılara açıktır; herkese açık
// başvuru yalnızca ayrı endpoint üzerinden alınır (Aşama 3), koleksiyon create'i public değildir.

const isLoggedIn = ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user)

// Production'da CV_STORAGE_DIR yoksa yerel diske hiç yazılmaz (disableLocalStorage);
// dosyalı create/update ayrıca beforeOperation hook'unda reddedilir.
const cvStorage = resolveCvStorageDir()

const optionalHttpsUrl = (value: unknown) => {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Geçersiz bağlantı'
  try {
    return new URL(value).protocol === 'https:' ? true : 'Bağlantı https:// ile başlamalı'
  } catch {
    return 'Geçersiz bağlantı'
  }
}

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: {
    singular: 'İş Başvurusu',
    plural: 'İş Başvuruları (CV Havuzu)',
  },
  admin: {
    useAsTitle: 'candidateName',
    defaultColumns: ['candidateName', 'email', 'experienceLevel', 'status', 'consentAt'],
    listSearchableFields: ['candidateName', 'email'],
    description:
      'Kariyer sayfasından gelen başvurular ve CV dosyaları. Kişisel veri içerir (KVKK): yalnızca gerektiği kadar açın, otomatik silme yoktur; saklama süresi dolanlar elle silinir.',
    components: {
      // Saklama süresi dolan CV ve yeni başvuru sayısı uyarısı (yalnızca uyarı, silme yok)
      beforeListTable: ['/components/admin/RetentionBanner#RetentionBanner'],
    },
  },
  // CV verisi GraphQL üzerinden hiç sunulmaz; REST ve admin paneli yeterli.
  graphQL: false,
  access: {
    read: isLoggedIn, // Dosya servisi (/api/job-applications/file/...) de bu kuralı kullanır
    create: isLoggedIn, // Herkese açık başvuru ayrı endpoint'ten gelir, burası public değil
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    mimeTypes: ['application/pdf'],
    crop: false, // PDF için görsel kırpma/odak noktası gereksiz
    focalPoint: false,
    // Aşama 5: yalnızca bu koleksiyonun dosya servisi etkilenir (Media vb. dokunulmaz)
    modifyResponseHeaders: hardenCvResponseHeaders,
    handlers: [logCvDownload],
    ...(cvStorage.ok ? { staticDir: cvStorage.dir } : { disableLocalStorage: true }),
  },
  endpoints: [
    {
      // Herkese açık başvuru: POST /api/job-applications/apply (bkz. lib/cv/apply.ts)
      path: '/apply',
      method: 'post',
      handler: applyHandler,
    },
  ],
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if ((operation !== 'create' && operation !== 'update') || !req.file) return

        // Fail-closed: depolama yapılandırılmamışsa dosya kabul edilmez, yerel dizine düşülmez.
        const storage = resolveCvStorageDir()
        if (!storage.ok) {
          req.payload.logger.error(`[cv] ${storage.reason} — dosya yazımı reddedildi`)
          throw new APIError('CV depolama alanı yapılandırılmamış; dosya kabul edilmedi.', 503, null, true)
        }

        if (req.file.size > MAX_CV_BYTES) {
          throw new APIError('CV dosyası en fazla 5 MB olabilir.', 400, null, true)
        }

        // Diskte aday adı / orijinal dosya adı kalmasın (admin paneli ve endpoint için ortak)
        req.file.name = cvFilename()
      },
    ],
  },
  fields: [
    {
      name: 'candidateName',
      type: 'text',
      required: true,
      label: 'Ad Soyad',
      maxLength: 120,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-posta',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
      maxLength: 30,
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn',
      validate: optionalHttpsUrl,
    },
    {
      name: 'githubUrl',
      type: 'text',
      label: 'GitHub',
      validate: optionalHttpsUrl,
    },
    {
      name: 'experienceLevel',
      type: 'select',
      required: true,
      label: 'Deneyim Seviyesi',
      options: EXPERIENCE_LEVELS.map((o) => ({ ...o })),
    },
    {
      name: 'fieldsOfInterest',
      type: 'select',
      hasMany: true,
      required: true,
      label: 'İlgi Alanları',
      options: FIELDS_OF_INTEREST.map((o) => ({ ...o })),
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Durum',
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'İncelendi', value: 'reviewed' },
        { label: 'İletişime Geçildi', value: 'contacted' },
        { label: 'Arşivlendi', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Arşivlemek silmek değildir; CV dosyası arşivde de saklanır.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Yönetici Notları',
      admin: {
        description: 'Yalnızca ekip içi notlar; adaya veya herkese açık API yanıtlarına dönmez.',
      },
    },
    // --- KVKK rıza kaydı ---
    {
      name: 'consentGiven',
      type: 'checkbox',
      required: true,
      label: 'Açık rıza verildi',
      validate: (value: unknown) => value === true || 'Açık rıza olmadan başvuru kaydedilemez',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'consentAt',
      type: 'date',
      required: true,
      label: 'Rıza Tarihi',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Saklama süresi bu tarihten itibaren hesaplanır.',
      },
    },
    {
      name: 'consentTextVersion',
      type: 'text',
      required: true,
      label: 'Rıza Metni Sürümü',
      admin: { position: 'sidebar', readOnly: true },
    },
    // --- Teknik kayıtlar (başvuru endpoint'i doldurur) ---
    {
      name: 'scanEngines',
      type: 'text',
      label: 'Uygulanan Güvenlik Kontrolleri',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'ipHash',
      type: 'text',
      label: 'IP Özeti (HMAC)',
      index: true,
      admin: {
        readOnly: true,
        hidden: true, // Ham IP saklanmaz; yalnızca kötüye kullanım sınırı için
      },
    },
  ],
}
