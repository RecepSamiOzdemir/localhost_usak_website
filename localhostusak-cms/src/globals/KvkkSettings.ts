import type { GlobalConfig } from 'payload'

export const KvkkSettings: GlobalConfig = {
  slug: 'kvkk-settings',
  label: 'KVKK & Hukuki Ayarlar',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // 1. Hero Bölümü
    {
      name: 'hero',
      type: 'group',
      label: '1. Karşılama (Hero) Alanı',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Üst Etiket',
          defaultValue: 'HUKUKİ BİLGİLENDİRME // 6698 SAYILI KANUN',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Ana Başlık',
          defaultValue: 'Kişisel Verilerin Korunması ve',
          required: true,
        },
        {
          name: 'highlightText',
          type: 'text',
          label: 'Vurgulu Başlık',
          defaultValue: 'Aydınlatma Metni',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Alt Açıklama Metni',
          defaultValue:
            'Localhost Uşak Teknoloji ve Yazılım Topluluğu üyelerinin, etkinlik katılımcılarının ve web sitesi ziyaretçilerimizin kişisel verilerinin korunması, işlenmesi ve etkinlik muvafakatnamesi.',
          required: true,
        },
      ],
    },

    // 2. Belge Meta ve İletişim Bilgileri
    {
      name: 'documentMeta',
      type: 'group',
      label: '2. Belge Durumu & İletişim',
      fields: [
        {
          name: 'badgeText',
          type: 'text',
          label: 'Rozet Metni',
          defaultValue: '6698 SAYILI KVKK UYUMLU',
        },
        {
          name: 'lastUpdated',
          type: 'text',
          label: 'Son Güncelleme',
          defaultValue: '2026',
        },
        {
          name: 'version',
          type: 'text',
          label: 'Belge Sürümü',
          defaultValue: 'Sürüm 1.1',
        },
        {
          name: 'contactEmail',
          type: 'text',
          label: 'Yetkili Başvuru E-Postası',
          defaultValue: 'localhostusak@gmail.com',
          required: true,
        },
      ],
    },

    // 3. Giriş Paragrafı
    {
      name: 'leadText',
      type: 'textarea',
      label: '3. Giriş / Kapsam Paragrafı',
      defaultValue:
        'Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu (“Localhost Uşak” veya “Topluluk”) tarafından; web sitemizi (localhostusak.com) ziyaret edenlerin, topluluk üyelerimizin, fiziki etkinlik ve coworking buluşmalarına katılan yazılımcı ve öğrencilerin, projelerini sergileyen ve kariyer panosunu kullanan paydaşlarımızın aydınlatılması amacıyla hazırlanmıştır.',
      required: true,
    },

    // 4. Özel Vurgu Kutuları (Fotoğraf/Video ve Fikri Mülkiyet)
    {
      name: 'callouts',
      type: 'group',
      label: '4. Önemli Vurgu Kutuları',
      fields: [
        {
          name: 'photoVideoTitle',
          type: 'text',
          label: 'Fotoğraf & Video Vurgu Başlığı',
          defaultValue: 'Önemli Bilgilendirme: Etkinlik Fotoğraf ve Video Çekimleri',
        },
        {
          name: 'photoVideoText',
          type: 'textarea',
          label: 'Fotoğraf & Video Açıklaması',
          defaultValue:
            'Localhost Uşak etkinlikleri, Uşak yerelindeki teknoloji ekosistemini görünür kılmak ve açık topluluk ruhunu teşvik etmek amacıyla fotoğraflanmakta ve kayda alınmaktadır. Bu görsel/işitsel materyaller; ticari olmayan amaçlarla, topluluğu tanıtmak, yapılan atölyeleri arşivlemek ve katılımcıların başarılarını paylaşmak üzere resmi web sitemizde (localhostusak.com), sosyal medya kanallarımızda (Instagram, X, LinkedIn, YouTube, GitHub) ve topluluk bültenlerinde süresiz olarak yayınlanabilir.',
        },
        {
          name: 'intellectualPropertyTitle',
          type: 'text',
          label: 'Fikri Mülkiyet Vurgu Başlığı',
          defaultValue: 'Fikri Mülkiyet Teminatı: Kodlar ve Projeler Geliştiriciye Aittir',
        },
        {
          name: 'intellectualPropertyText',
          type: 'textarea',
          label: 'Fikri Mülkiyet Açıklaması',
          defaultValue:
            'Projelerin tüm fikri ve sınai mülkiyet hakları, münhasıran projeyi üreten geliştiriciye, ekibe veya ilgili açık kaynak lisansına aittir. Localhost Uşak; paylaşılan projeleri topluluk vitrininde, web sitesinde, haber bültenlerinde ve sosyal medyada sahibini açıkça belirterek bedelsiz olarak tanıtma, sergileme ve yayınlama hakkına sahiptir.',
        },
      ],
    },

    // 5. Açık Rıza ve Muvafakatname Beyanı
    {
      name: 'consent',
      type: 'group',
      label: '5. Muvafakatname ve Açık Rıza Beyanı',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Onay Kutusu Rozeti',
          defaultValue: 'ETKİNLİK VE TOPLULUK MUVAFAKATNAMESİ',
        },
        {
          name: 'declarationText',
          type: 'textarea',
          label: 'Açık Rıza Beyan Metni',
          defaultValue:
            "Localhost Uşak Kişisel Verilerin Korunması Aydınlatma Metni ve Etkinlik Muvafakatnamesi'ni okuduğumu, etkinliklerde çekilen fotoğraf/video kayıtlarımın topluluk tanıtımı kapsamında dijital mecralarda yayınlanmasına ve kişisel verilerimin bu metinde belirtilen amaç ve ilkeler doğrultusunda işlenmesine özgür irademle açık rıza veriyorum.",
          required: true,
        },
        {
          name: 'dateNote',
          type: 'text',
          label: 'Onay Tarihi İbaresi',
          defaultValue: 'Etkinlik / Grup Katılım Anı',
        },
        {
          name: 'dataControllerName',
          type: 'text',
          label: 'Veri Sorumlusu Adı',
          defaultValue: 'Localhost Uşak',
        },
      ],
    },

    // 6. Maddeler / Bölümler (İsteğe bağlı dinamik maddeler)
    {
      name: 'sections',
      type: 'array',
      label: '6. KVKK Maddeleri (İçerik Bölümleri)',
      labels: {
        singular: 'Madde / Bölüm',
        plural: 'Maddeler / Bölümler',
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          label: 'Bağlantı Kimliği (Slug - örn: genel-bakis)',
          required: true,
        },
        {
          name: 'num',
          type: 'text',
          label: 'Madde No (Örn: 01)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Madde Başlığı',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Açıklama Metni',
        },
      ],
    },
  ],
}
