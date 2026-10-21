import type { GlobalConfig } from 'payload'

import { DEFAULT_RETENTION_YEARS, MAX_RETENTION_YEARS, MIN_RETENTION_YEARS } from '../lib/cv/retention'

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

    // 5. CV Başvuru Formu (FAZ 6) — özellik bayrağı varsayılan KAPALI
    {
      name: 'applicationForm',
      type: 'group',
      label: '5. CV Başvuru Formu',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Başvuru formu açık',
          defaultValue: false,
          admin: {
            description:
              'docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md tamamlanmadan (volume, CV_STORAGE_DIR, CV_IP_HASH_SECRET, yanlış pozitif testi) açmayın.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Form Başlığı',
          defaultValue: 'CV Havuzuna Katıl',
        },
        {
          name: 'intro',
          type: 'textarea',
          label: 'Form Giriş Metni',
          defaultValue:
            'CV’nizi topluluğun yetenek havuzuna ekleyin; uygun iş, staj, freelance veya mentorluk fırsatı olduğunda sizinle iletişime geçelim. Yalnızca PDF, en fazla 5 MB.',
        },
        // KVKK metinleri TASLAKTIR: hukuki onay alınmadan bayrak açılmamalı (plan Aşama 8).
        // {{retentionYears}} ifadesini web formu saklama süresi değeriyle değiştirir (metin tekrarı olmasın diye).
        {
          name: 'privacyNotice',
          type: 'textarea',
          label: 'CV Aydınlatma Metni (TASLAK — Hukuki inceleme gerekir)',
          defaultValue: [
            'Veri sorumlusu: Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu (“Localhost Uşak”).',
            'İşlenen veriler: Ad soyad, e-posta, (isteğe bağlı) telefon, LinkedIn ve GitHub bağlantıları, deneyim seviyesi, ilgi alanları, yüklediğiniz CV dosyası ve içeriği, açık rıza tarihi ve rıza metni sürümü. Kötüye kullanımı önlemek için IP adresinizin geri döndürülemez özeti tutulur; ham IP adresi saklanmaz.',
            'Amaç: CV’nizi topluluğun yetenek havuzunda tutmak ve uygun iş, staj, freelance veya mentorluk fırsatlarında sizinle iletişime geçmek.',
            'Toplama yöntemi ve hukuki sebep: Verileriniz bu form aracılığıyla elektronik ortamda toplanır ve KVKK m. 5/1 uyarınca açık rızanıza dayanılarak işlenir. Rıza vermemeniz yalnızca CV havuzuna katılamamanız sonucunu doğurur.',
            'Kimler görebilir: CV’niz Localhost Uşak yönetim ekibi tarafından görüntülenir. Veriler teknik altyapı (barındırma) hizmeti alınan sağlayıcının sunucularında saklanır; sağlayıcı verilere kendi amacıyla erişmez.',
            'Verilerin aktarılması: CV’niz ve başvuru bilgileriniz (ad soyad, e-posta, varsa telefon, LinkedIn/GitHub bağlantıları, deneyim seviyesi, ilgi alanları ve CV dosyanız); yetkinlikleriniz doğrultusunda Uşak’taki sponsor ve iş birliği yaptığımız uygun firmalarla (teknoloji, yazılım ve ilgili sektörlerde faaliyet gösteren işverenler) eşleştirilmek ve size iş, staj, freelance veya mentorluk fırsatı iletmek amacıyla bu firmalara aktarılabilir. Aktarım yalnızca sizinle ilgili bir fırsat olduğunda ve yönetim ekibi aracılığıyla yapılır; firmalar bu verileri kendi işe alım değerlendirmeleri için işler ve ayrıca veri sorumlusu olurlar. IP adresi özetiniz ve rıza kayıtlarınız firmalara aktarılmaz. Verileriniz satılmaz; yasal zorunluluk hâlinde yetkili kamu kurumlarıyla paylaşılabilir.',
            'Yurt dışına aktarım: Verileriniz Türkiye’de bulunan bir sunucuda saklanır ve yurt dışına aktarılmaz. Aktarım yapılacak firmalar Türkiye’de yerleşik firmalardır.',
            'Saklama süresi: Verileriniz rıza tarihinden itibaren en fazla {{retentionYears}} yıl saklanır ve süre dolduğunda yönetim ekibi tarafından silinir. Rızanızı daha önce geri alır veya silinmesini talep ederseniz bu süre beklenmeden silinir.',
            'Uyarı: CV’nizde özel nitelikli kişisel veri (sağlık, din, mezhep, etnik köken, siyasi görüş, dernek/sendika üyeliği, ceza mahkûmiyeti, biyometrik veri vb.), T.C. kimlik numarası veya fotoğraf bulundurmayın.',
            'Yaş ve başvuru sahibi: Bu forma yalnızca 18 yaşını doldurmuş kişiler başvurabilir ve başvuru yalnızca kişinin kendi adına yapılabilir; başkası adına başvuru yapılamaz.',
            'Haklarınız: KVKK m. 11 kapsamında verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme/yok etme, aktarıldığı kişileri öğrenme ve itiraz etme haklarına sahipsiniz; rızanızı dilediğiniz zaman geri alabilirsiniz (geri alma, daha önce yapılan işlemleri hukuka aykırı hâle getirmez). Talebinizi, /kvkk sayfasındaki KVKK Aydınlatma Metni’nde belirtilen iletişim adresine iletebilirsiniz; başvurular en geç 30 gün içinde yanıtlanır.',
          ].join('\n\n'),
          admin: {
            description:
              '⚠ Hukuki inceleme gerekir: Bu metin taslaktır; hukuki onay alınmadan form açılmamalıdır. {{retentionYears}} ifadesi formda saklama süresiyle değiştirilir. Bu metni değiştirirseniz "Rıza / Aydınlatma Metni Sürümü" alanını da değiştirin.',
          },
        },
        {
          name: 'consentText',
          type: 'textarea',
          label: 'Açık Rıza Metni (TASLAK — Hukuki inceleme gerekir)',
          defaultValue:
            'CV Havuzu Aydınlatma Metni’ni okudum ve anladım. Kimlik, iletişim ve mesleki bilgilerimle CV’mdeki kişisel verilerimin, Localhost Uşak yetenek havuzunda tutulması, uygun fırsatlarda benimle iletişime geçilmesi ve yetkinliklerime göre Uşak’taki sponsor ve uygun firmalarla eşleştirilip bu firmalara aktarılması amacıyla, rıza tarihinden itibaren en fazla {{retentionYears}} yıl süreyle işlenmesine özgür irademle açık rıza veriyorum. 18 yaşını doldurduğumu, bu başvuruyu kendi adıma yaptığımı ve başkası adına başvuru yapmadığımı, paylaştığım bilgilerin bana ait ve doğru olduğunu beyan ederim. Rızamı dilediğim zaman geri alabileceğimi biliyorum.',
          admin: {
            description:
              '⚠ Hukuki inceleme gerekir: Bu metin taslaktır. Onay kutusu önceden işaretli gösterilmez; etkinlik/fotoğraf muvafakatiyle birleştirilmez. Bu metni değiştirirseniz "Rıza / Aydınlatma Metni Sürümü" alanını MUTLAKA değiştirin.',
          },
        },
        {
          name: 'consentVersion',
          type: 'text',
          label: 'Rıza / Aydınlatma Metni Sürümü',
          defaultValue: 'cv-v1',
          admin: {
            description:
              'Açık rıza metni, aydınlatma metni veya saklama süresi değiştiğinde bu değer de MUTLAKA değiştirilmelidir (örn. cv-v1 → cv-v2). Her başvuruya bu değer kaydedilir; hangi adayın hangi metne onay verdiği buradan anlaşılır.',
          },
        },
        {
          name: 'retentionYears',
          type: 'number',
          label: 'CV Saklama Süresi (yıl)',
          defaultValue: DEFAULT_RETENTION_YEARS,
          min: MIN_RETENTION_YEARS,
          max: MAX_RETENTION_YEARS,
          // Kesirli değer (örn. 1,5) metinde ve uyarıda farklı sonuç vermesin diye yalnızca tam sayı
          validate: (value: number | null | undefined) =>
            value === null ||
            value === undefined ||
            (Number.isInteger(value) && value >= MIN_RETENTION_YEARS && value <= MAX_RETENTION_YEARS) ||
            `${MIN_RETENTION_YEARS}–${MAX_RETENTION_YEARS} arasında tam sayı girin`,
          admin: {
            step: 1,
            description:
              'Rıza tarihinden itibaren en fazla bu kadar yıl saklanır. Otomatik silme YOKTUR: süresi dolan CV’ler İş Başvuruları listesinde uyarı olarak gösterilir ve elle silinir. Değiştirirseniz aydınlatma/rıza metinleri de değişmiş sayılır; sürüm alanını güncelleyin.',
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          label: 'Başarılı Başvuru Mesajı',
          defaultValue:
            'Başvurunuz alındı. CV’niz yetenek havuzumuza eklendi; uygun bir fırsat olduğunda sizinle iletişime geçeceğiz.',
        },
      ],
    },
  ],
}
