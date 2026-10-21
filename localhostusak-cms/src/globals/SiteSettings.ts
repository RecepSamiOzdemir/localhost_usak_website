import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ana Sayfa Ayarları',
  access: {
    read: () => true, // Frontend can read publicly
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // 1. Hero Bölümü
    {
      name: 'hero',
      type: 'group',
      label: '1. Hero (Karşılama) Bölümü',
      fields: [
        {
          name: 'cityCoordinates',
          type: 'text',
          label: 'Şehir Koordinatları',
          defaultValue: '38.6823° N, 29.4082° E',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Ana Başlık (1. Satır)',
          defaultValue: "Uşak'ta Teknoloji",
        },
        {
          name: 'titleHighlight',
          type: 'text',
          label: 'Vurgulu Başlık (2. Satır Renkli)',
          defaultValue: 'Etrafında Buluş',
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Terminal Sloganı',
          defaultValue: 'CONNECT • BUILD • COLLABORATE • GROW',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama Metni',
          defaultValue:
            'Teknolojiye ilgi duyan, üreten ve gelişmek isteyen insanları bir araya getiren lokal topluluk. Kahveni al, laptopunu getir, masada yerini al.',
        },
      ],
    },

    // 1.5 Topluluk Vizyon Mesajları (Otomatik Dönen Vizyon Kartı)
    {
      name: 'visionMessages',
      type: 'array',
      label: '1.5 Topluluk Vizyon Mesajları (Otomatik Rotasyon)',
      admin: {
        description: 'Manifesto & Misyon kartında periyodik olarak otomatik değişen vizyon sözleri.',
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Vizyon Mesajı / Söz',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Vurgu / Etiket (Örn: #Vizyonumuz veya Good Code, Better People)',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Kaynak / İbare (Opsiyonel)',
        },
      ],
    },

    // 2. Scoreboard & Rakamlarla Topluluk
    {
      name: 'stats',
      type: 'array',
      label: '2. Rakamlarla Topluluk (Stats)',
      admin: {
        description: 'Ana sayfadaki sayaç kartları (Örn: 150+ Topluluk Üyesi)',
      },
      fields: [
        {
          name: 'target',
          type: 'number',
          label: 'Hedef Sayı',
          required: true,
        },
        {
          name: 'prefix',
          type: 'text',
          label: 'Önek (Örn: # veya %)',
          defaultValue: '',
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Sonek (Örn: +)',
          defaultValue: '',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Etiket / Başlık',
          required: true,
        },
      ],
    },

    // 3. Değerlerimiz (Values Bento)
    {
      name: 'values',
      type: 'array',
      label: '3. Değerlerimiz (Values Bento)',
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'İkon / Emoji (Örn: 🧡, 🚀, ☕, 💡)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Kart Başlığı',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama',
          required: true,
        },
        {
          name: 'tags',
          type: 'text',
          label: 'Etiketler (Virgülle ayrılmış, örn: #Samimiyet, #Eşitlik)',
        },
      ],
    },

    // 4. Masada Kimler Var? (Personas)
    {
      name: 'personas',
      type: 'array',
      label: '4. Masada Kimler Var? (Katılımcı Profilleri)',
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'İkon / Emoji (Örn: 💡, ⚙️, </>, 🌍)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Profil Başlığı (Örn: Yazılım Geliştirici)',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Açıklama',
          required: true,
        },
        {
          name: 'tags',
          type: 'text',
          label: 'Etiketler (Virgülle ayrılmış, örn: Frontend, Backend, Cloud)',
        },
      ],
    },

    // 5. Buluşma Formatı (Flow Steps)
    {
      name: 'flowSteps',
      type: 'array',
      label: '5. Buluşma Formatı (4 Adım)',
      fields: [
        {
          name: 'num',
          type: 'text',
          label: 'Adım No (Örn: 01)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Adım Başlığı (Örn: Tanışma & Kahve)',
          required: true,
        },
        {
          name: 'desc',
          type: 'textarea',
          label: 'Açıklama',
          required: true,
        },
      ],
    },

    // 6. Kariyer Rehberleri & Kaynaklar
    {
      name: 'careerResources',
      type: 'array',
      label: '6. Kariyer Sayfası Kaynakları & Rehberler',
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'İkon (Örn: 📄, 🎯, 🌐, 🤝)',
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
  ],
}
