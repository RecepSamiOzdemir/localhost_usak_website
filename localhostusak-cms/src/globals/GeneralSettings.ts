import type { GlobalConfig } from 'payload'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'Genel Site & SEO Ayarları',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // 1. Genel SEO ve Meta Etiketleri
    {
      name: 'meta',
      type: 'group',
      label: '1. Genel SEO & Meta Bilgileri',
      fields: [
        {
          name: 'siteTitle',
          type: 'text',
          label: 'Varsayılan Site Başlığı',
          defaultValue: 'Uşak Teknoloji ve Yazılım Topluluğu | localhostusak',
          required: true,
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          label: 'Varsayılan Meta Açıklama',
          defaultValue:
            "Uşak'ta yazılımcılar, mühendisler ve teknoloji meraklıları için açık topluluk. Coworking buluşmaları, açık kaynak projeleri ve kariyer paylaşımları.",
          required: true,
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Anahtar Kelimeler (Virgülle ayrılmış)',
          defaultValue:
            'Uşak yazılım, Uşak teknoloji, localhostusak, developer community, UI UX Uşak, Uşak meetup, remote çalışma, coworking',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Varsayılan Sosyal Paylaşım Görseli (OG Image)',
        },
      ],
    },

    // 2. Header & Üst Duyuru Bandı
    {
      name: 'header',
      type: 'group',
      label: '2. Üst Menü & Duyuru Bandı',
      fields: [
        {
          name: 'announcementActive',
          type: 'checkbox',
          label: 'Duyuru Bandı Aktif mi?',
          defaultValue: false,
        },
        {
          name: 'announcementText',
          type: 'text',
          label: 'Duyuru Metni',
          defaultValue: '🎉 Yeni buluşma takvimimiz açıklandı! Detaylar etkinlikler sayfasında.',
        },
        {
          name: 'announcementUrl',
          type: 'text',
          label: 'Duyuru Yönlendirme Linki (Opsiyonel)',
          defaultValue: '/etkinlikler',
        },
      ],
    },

    // 3. Footer Alt Bilgiler
    {
      name: 'footer',
      type: 'group',
      label: '3. Footer (Alt Bilgi) Ayarları',
      fields: [
        {
          name: 'tagline',
          type: 'textarea',
          label: 'Marka Sloganı / Açıklaması',
          defaultValue:
            "Uşak'ın yerel teknoloji ve yazılım ekosistemini büyüten açık ve bağımsız topluluk.",
        },
        {
          name: 'locationCoordinates',
          type: 'text',
          label: 'Şehir Koordinatları',
          defaultValue: '38.6823° N, 29.4082° E',
        },
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Telif Hakkı Metni',
          defaultValue: "© 2026 localhostusak • Uşak'ta geliştirildi",
        },
      ],
    },
  ],
}
