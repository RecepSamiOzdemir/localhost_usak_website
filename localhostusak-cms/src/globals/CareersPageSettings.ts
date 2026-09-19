import type { GlobalConfig } from 'payload'

export const CareersPageSettings: GlobalConfig = {
  slug: 'careers-page-settings',
  label: 'Kariyer Sayfası Ayarları',
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
          defaultValue: '// KARİYER & FIRSAT PANOSU',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Ana Başlık (1. Satır)',
          defaultValue: "Uşak'tan Globale,",
          required: true,
        },
        {
          name: 'highlightText',
          type: 'text',
          label: 'Vurgulu Başlık (2. Satır Renkli)',
          defaultValue: 'Doğru Fırsatı Yakala',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama Metni',
          defaultValue:
            'Topluluk üyelerinin paylaştığı iş ilanları, staj fırsatları, freelance projeler ve ücretsiz mentorluk eşleşmeleri.',
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
          defaultValue: 'WhatsApp Kariyer Grubuna Katıl',
        },
        {
          name: 'overrideUrl',
          type: 'text',
          label: 'Özel WhatsApp Linki (Boş bırakılırsa genel link kullanılır)',
        },
      ],
    },

    // 3. Kariyer Rehberleri ve Kaynaklar
    {
      name: 'careerResources',
      type: 'array',
      label: '3. Kariyer Rehberleri & Kaynak Kartları',
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'İkon (Emoji)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Başlık',
          required: true,
        },
        {
          name: 'desc',
          type: 'textarea',
          label: 'Açıklama',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Etiket (Örn: #KariyerRehberi)',
        },
      ],
    },

    // 4. Sayfa Özel SEO & Meta
    {
      name: 'meta',
      type: 'group',
      label: '4. Sayfa SEO & Meta Etiketleri',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tarayıcı Sekme Başlığı',
          defaultValue: 'Kariyer & İlanlar — localhostusak',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Açıklama',
          defaultValue:
            "Uşak ve uzaktan çalışma olanakları; teknoloji, yazılım, staj ve freelance kariyer fırsatları panosu.",
        },
      ],
    },
  ],
}
