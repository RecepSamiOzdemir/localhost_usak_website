import type { GlobalConfig } from 'payload'

export const EventsPageSettings: GlobalConfig = {
  slug: 'events-page-settings',
  label: 'Etkinlikler Sayfası Ayarları',
  access: {
    read: () => true,
  },
  fields: [
    // 1. Hero Bölümü
    {
      name: 'hero',
      type: 'group',
      label: '1. Karşılama (Hero) Bölümü',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Üst Etiket (Terminal formatı)',
          defaultValue: '// ETKİNLİK TAKVİMİ & COWORKING',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Ana Başlık (1. Satır)',
          defaultValue: "Cowork'ten Workshop'a,",
          required: true,
        },
        {
          name: 'highlightText',
          type: 'text',
          label: 'Vurgulu Başlık (2. Satır Renkli)',
          defaultValue: 'Tüm Buluşmalar',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama Metni',
          defaultValue:
            "Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak'ta aynı masada.",
          required: true,
        },
      ],
    },

    // 2. WhatsApp ve Aksiyon Butonu
    {
      name: 'whatsappCta',
      type: 'group',
      label: '2. WhatsApp ve Aksiyon Butonu',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          label: 'Buton Metni',
          defaultValue: 'WhatsApp Coworking Grubuna Katıl',
        },
        {
          name: 'overrideUrl',
          type: 'text',
          label: 'Özel WhatsApp Linki (Boş bırakılırsa genel link kullanılır)',
        },
      ],
    },

    // 3. Sayfa Özel SEO & Meta
    {
      name: 'meta',
      type: 'group',
      label: '3. Sayfa SEO & Meta Etiketleri',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tarayıcı Sekme Başlığı',
          defaultValue: 'Etkinlikler & Coworking — localhostusak',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Açıklama',
          defaultValue:
            "Uşak'taki yazılım, tasarım ve yapay zeka buluşmaları, coworking günleri ve workshop takvimi.",
        },
      ],
    },
  ],
}
