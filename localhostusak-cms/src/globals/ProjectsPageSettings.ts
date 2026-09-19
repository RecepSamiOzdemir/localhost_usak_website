import type { GlobalConfig } from 'payload'

export const ProjectsPageSettings: GlobalConfig = {
  slug: 'projects-page-settings',
  label: 'Projeler Sayfası Ayarları',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
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
          defaultValue: '// PROJE VİTRİNİ & AÇIK KAYNAK',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Ana Başlık (1. Satır)',
          defaultValue: "Uşak'ta Üretiliyor,",
          required: true,
        },
        {
          name: 'highlightText',
          type: 'text',
          label: 'Vurgulu Başlık (2. Satır Renkli)',
          defaultValue: 'Dünyaya Açılıyor',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama Metni',
          defaultValue:
            'Topluluk üyelerimizin geliştirdiği açık kaynak projeler, erken aşama girişimler ve birlikte üretmek için ekip arkadaşı arayanlar.',
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
          defaultValue: 'WhatsApp Projeler Grubuna Katıl',
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
          defaultValue: 'Projeler & Vitrin — localhostusak',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Açıklama',
          defaultValue:
            "Uşak teknoloji topluluğu üyelerinin geliştirdiği projeler, açık kaynak depoları ve ekip arkadaşı arayan girişimler.",
        },
      ],
    },
  ],
}
