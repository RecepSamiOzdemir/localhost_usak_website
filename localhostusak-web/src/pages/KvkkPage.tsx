import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Camera,
  Code2,
  Scale,
  FileText,
  Globe2,
  Clock,
  Lock,
  Mail,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';
import seoPages from '../seo/pages.json';
import { fetchKvkkSettings, KvkkSettingsData } from '../services/api';

const DEFAULT_SECTIONS = [
  { id: 'genel-bakis', num: '01', title: 'Veri Sorumlusu & Kapsam' },
  { id: 'islenen-veriler', num: '02', title: 'İşlenen Kişisel Veriler' },
  { id: 'isleme-amaclari', num: '03', title: 'İşlenme Amaçları' },
  { id: 'aktarim', num: '04', title: 'Verilerin Aktarımı' },
  { id: 'yurtdisi', num: '05', title: 'Yurtdışına Aktarım' },
  { id: 'hukuki-sebep', num: '06', title: 'Yöntem ve Hukuki Sebepler' },
  { id: 'fikri-mulkiyet', num: '07', title: 'Fikri ve Sınai Mülkiyet Hakları' },
  { id: 'saklama-guvenlik', num: '08', title: 'Saklama Süresi ve Güvenlik' },
  { id: 'haklar', num: '09', title: 'KVKK Madde 11 Haklarınız' },
  { id: 'basvuru', num: '10', title: 'İletişim ve Başvuru Usulü' },
  { id: 'muvafakatname', num: '11', title: 'Açık Rıza ve Muvafakatname' },
];

export const KvkkPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('genel-bakis');
  const [settings, setSettings] = useState<KvkkSettingsData | null>(null);

  // SEO metadata
  usePageMeta({
    title: (seoPages as Record<string, { title: string; description: string }>)["/kvkk"]?.title || "KVKK Aydınlatma Metni ve Muvafakatname | localhostusak",
    description: (seoPages as Record<string, { title: string; description: string }>)["/kvkk"]?.description || "Localhost Uşak Teknoloji ve Yazılım Topluluğu 6698 sayılı KVKK kapsamındaki kişisel verilerin korunması aydınlatma metni ve etkinlik muvafakatnamesi.",
  });

  // Fetch dynamic settings from Payload CMS
  useEffect(() => {
    fetchKvkkSettings().then((data) => {
      if (data) setSettings(data);
    }).catch(() => {
      // Fallback to static defaults
    });
  }, []);

  const sections = settings?.sections && settings.sections.length > 0
    ? settings.sections
    : DEFAULT_SECTIONS;

  // Dynamic Scroll Spy: track currently viewed section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 140; // Offset for sticky navigation
          for (let i = sections.length - 1; i >= 0; i--) {
            const element = document.getElementById(sections[i].id);
            if (element) {
              const top = element.offsetTop;
              if (scrollPosition >= top) {
                setActiveSection(sections[i].id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const declarationText = settings?.consent?.declarationText ||
    `Localhost Uşak Kişisel Verilerin Korunması Aydınlatma Metni ve Etkinlik Muvafakatnamesi'ni okuduğumu, etkinliklerde çekilen fotoğraf/video kayıtlarımın topluluk tanıtımı kapsamında dijital mecralarda yayınlanmasına ve kişisel verilerimin bu metinde belirtilen amaç ve ilkeler doğrultusunda işlenmesine özgür irademle açık rıza veriyorum.`;

  const contactEmail = settings?.documentMeta?.contactEmail || 'localhostusak@gmail.com';

  const handleCopyDeclaration = async () => {
    try {
      await navigator.clipboard.writeText(declarationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <main className="kvkk-page">
      <PageHero
        tag={settings?.hero?.tag || "HUKUKİ BİLGİLENDİRME // 6698 SAYILI KANUN"}
        title={settings?.hero?.title || "Kişisel Verilerin Korunması ve"}
        highlightText={settings?.hero?.highlightText || "Aydınlatma Metni"}
        description={settings?.hero?.description || "Localhost Uşak Teknoloji ve Yazılım Topluluğu üyelerinin, etkinlik katılımcılarının ve web sitesi ziyaretçilerimizin kişisel verilerinin korunması, işlenmesi ve etkinlik muvafakatnamesi."}
        secondaryAction={
          <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        }
      />

      <div className="container kvkk-wrapper">
        {/* Header Document Summary Card */}
        <section className="kvkk-header-card" aria-label="Belge Özeti">
          <div className="kvkk-header-meta">
            <div className="kvkk-badge-group">
              <span className="kvkk-pill-badge">
                <ShieldCheck size={14} /> {settings?.documentMeta?.badgeText || '6698 SAYILI KVKK UYUMLU'}
              </span>
              <span className="kvkk-pill-badge kvkk-pill-badge-neutral">
                Son Güncelleme: {settings?.documentMeta?.lastUpdated || '2026'}
              </span>
              <span className="kvkk-pill-badge kvkk-pill-badge-neutral">
                {settings?.documentMeta?.version || 'Sürüm 1.1'}
              </span>
            </div>

            <div className="kvkk-quick-actions">
              <button
                type="button"
                className="kvkk-action-btn"
                onClick={handleCopyDeclaration}
                title="Muvafakat metnini panoya kopyala"
              >
                {copied ? <Check size={14} style={{ color: 'var(--accent-success)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Kopyalandı' : 'Rıza Metnini Kopyala'}</span>
              </button>

              <a
                href={`mailto:${contactEmail}?subject=KVKK%20Hakk%C4%B1nda%20Bilgi%20Talebi`}
                className="kvkk-action-btn"
                title="Yönetime e-posta gönder"
              >
                <Mail size={14} />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>

          <p className="kvkk-lead-text">
            {settings?.leadText || (
              <>
                Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla
                <strong> Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu</strong> (“Localhost Uşak” veya “Topluluk”)
                tarafından; web sitemizi (<span style={{ color: 'var(--accent-primary)' }}>localhostusak.com</span>) ziyaret edenlerin,
                topluluk üyelerimizin, fiziki etkinlik ve coworking buluşmalarına katılan yazılımcı ve öğrencilerin,
                projelerini sergileyen ve kariyer panosunu kullanan paydaşlarımızın aydınlatılması amacıyla hazırlanmıştır.
              </>
            )}
          </p>
        </section>

        {/* Mobile Sticky Quick Navigation Bar */}
        <nav className="kvkk-mobile-chips-wrapper" aria-label="Hızlı Konu Gezinimi">
          <div className="kvkk-mobile-chips-header">
            <FileText size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>KONU BAŞLIKLARI</span>
          </div>
          <div className="kvkk-mobile-chips-track">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`kvkk-mobile-chip ${activeSection === sec.id ? 'active' : ''}`}
                onClick={(e) => scrollToSection(e, sec.id)}
              >
                <span className="kvkk-mobile-chip-num">{sec.num}</span>
                <span>{sec.title}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Centered & Balanced Grid Layout */}
        <div className="kvkk-grid-layout">
          {/* Left Sticky Dynamic Sidebar */}
          <aside className="kvkk-sidebar-wrapper">
            <nav className="kvkk-toc-card" aria-label="Sayfa İçi İçindekiler">
              <div className="kvkk-toc-title">
                <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>İÇİNDEKİLER</span>
              </div>
              <ul className="kvkk-toc-list">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={`kvkk-toc-link ${activeSection === sec.id ? 'active' : ''}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                    >
                      <span className="kvkk-toc-num">{sec.num}</span>
                      <span className="kvkk-toc-text">{sec.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Quick Contact Card */}
            <div className="kvkk-support-card">
              <h4>Veri Sahibi Başvurusu</h4>
              <p>
                Kişisel verilerinizle ilgili sorularınız veya hak kullanım talepleriniz için topluluk yöneticilerimize
                doğrudan ulaşabilirsiniz.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', width: '100%', justifyContent: 'center' }}
              >
                <Mail size={14} />
                <span>E-Posta ile İletişim</span>
              </a>
            </div>
          </aside>

          {/* Right Main Article Content */}
          <article className="kvkk-content-card">
            {/* Section 1 */}
            <section id="genel-bakis" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><ShieldCheck size={20} /></span>
                <h2 className="kvkk-section-title">1. Veri Sorumlusu ve Kapsam</h2>
              </div>
              <p className="kvkk-body-text">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, <strong>Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu</strong> olarak
                veri sorumlusu sıfatıyla; kişisel verilerinizin güvenliğine, gizliliğine ve hukuka uygun şekilde işlenmesine azami hassasiyeti göstermekteyiz.
              </p>
              <p className="kvkk-body-text">
                Bu aydınlatma metni ve muvafakatname; dijital platformlarımız (web sitesi, açık kaynak depoları, iletişim kanalları) ile fiziksel ortamda
                düzenlenen coworking günleri, kodlama atölyeleri, meetup ve seminerlerde toplanan kişisel verileri kapsamaktadır.
              </p>
            </section>

            {/* Section 2 */}
            <section id="islenen-veriler" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><FileText size={20} /></span>
                <h2 className="kvkk-section-title">2. İşlenen Kişisel Veriler</h2>
              </div>
              <p className="kvkk-body-text">
                Topluluğumuz tarafından yürütülen faaliyetler doğrultusunda, veri sahiplerinin kategorilerine göre aşağıdaki kişisel veriler işlenebilmektedir:
              </p>
              <ul className="kvkk-bullet-list">
                <li>
                  <strong>Kimlik ve İletişim Bilgileri:</strong> Ad, soyad, e-posta adresi ve telefon numarası (Topluluk etkinliklerine katılım, atölye kayıtları ve WhatsApp gruplarına giriş taleplerinde).
                </li>
                <li>
                  <strong>Mesleki, Eğitim ve Portfolyo Bilgileri:</strong> Çalışma durumu, unvan, uzmanlık alanı, okul/bölüm, GitHub profili, LinkedIn bağlantısı ve paylaşılan proje reposu bilgileri (Kariyer panosu ilanları, mentörlük eşleştirmeleri ve proje vitrini kapsamında).
                </li>
                <li>
                  <strong>Görsel ve İşitsel Kayıtlar:</strong> Fiziksel etkinliklerimizde, kafe buluşmalarımızda ve sunumlarda çekilen fotoğraf ve video kayıtları.
                </li>
                <li>
                  <strong>Dijital Kullanım Verileri:</strong> Web sitesi ziyaretlerinde kaydedilen temel IP adresi, tarayıcı türü, oturum tercihleri ve anonim kullanım istatistikleri.
                </li>
              </ul>

              {/* Highlight callout for photos/videos */}
              <div className="kvkk-callout-box media-highlight">
                <div className="kvkk-callout-title">
                  <Camera size={18} style={{ color: 'var(--accent-amber)' }} />
                  <span>{settings?.callouts?.photoVideoTitle || 'Önemli Bilgilendirme: Etkinlik Fotoğraf ve Video Çekimleri'}</span>
                </div>
                <p className="kvkk-callout-text">
                  {settings?.callouts?.photoVideoText || (
                    <>
                      Localhost Uşak etkinlikleri, Uşak yerelindeki teknoloji ekosistemini görünür kılmak ve açık topluluk ruhunu teşvik etmek amacıyla
                      fotoğraflanmakta ve kayda alınmaktadır. Bu görsel/işitsel materyaller; <strong>ticari olmayan amaçlarla</strong>, topluluğu tanıtmak,
                      yapılan atölyeleri arşivlemek ve katılımcıların başarılarını paylaşmak üzere resmi web sitemizde (<code>localhostusak.com</code>),
                      sosyal medya kanallarımızda (Instagram, X, LinkedIn, YouTube, GitHub) ve topluluk bültenlerinde süresiz olarak yayınlanabilir.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="isleme-amaclari" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Code2 size={20} /></span>
                <h2 className="kvkk-section-title">3. Kişisel Verilerin İşlenme Amaçları</h2>
              </div>
              <p className="kvkk-body-text">
                Toplanan kişisel verileriniz aşağıdaki amaçlarla mevzuata uygun biçimde işlenmektedir:
              </p>
              <ul className="kvkk-bullet-list">
                <li>Uşak'ta teknoloji, yazılım, yapay zeka, tasarım ve mühendislik alanlarında açık kaynak ve coworking etkinliklerinin planlanması ve organizasyonu,</li>
                <li>Topluluk üyelerimizin geliştirdiği açık kaynak projelerin, ürünlerin ve girişimlerin vitrinde sergilenmesi, ekip arkadaşı arayışlarının duyurulması,</li>
                <li>Topluluğa özel kariyer ve staj fırsatlarının duyurulması, genç yeteneklerin mentörlerle buluşturulması,</li>
                <li>Topluluk güvenliğinin, saygı ortamının ve <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Topluluk Kuralları</Link>'nın işletilmesi; spam, izinsiz toplu mesaj ve rahatsız edici girişimlerin önlenmesi,</li>
                <li>Web sitesinin teknik güvenliğinin, performansının ve kullanıcı dostu yapısının korunması.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="aktarim" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Globe2 size={20} /></span>
                <h2 className="kvkk-section-title">4. İşlenen Kişisel Verilerin Aktarımı</h2>
              </div>
              <p className="kvkk-body-text">
                Toplanan kişisel verileriniz hiçbir surette <strong>ticari amaçla üçüncü kişilere satılmaz, kiralanmaz veya menfaat karşılığı devredilmez.</strong>
              </p>
              <p className="kvkk-body-text">
                Verileriniz yalnızca topluluk faaliyetlerinin yürütülmesi amacıyla ve zorunlu hallerde:
              </p>
              <ul className="kvkk-bullet-list">
                <li><strong>Etkinlik Mekânları ve İş Birlikçileri:</strong> Buluşmaların organize edildiği kütüphaneler, teknokentler, üniversiteler, kafeler veya salon yönetimleri ile (yalnızca salon kapasitesi teyidi ve güvenlik akreditasyonu sınırında),</li>
                <li><strong>Teknik Altyapı Sağlayıcıları:</strong> Web sitemizin barındırma (hosting), veri tabanı, CMS ve e-posta bildirim hizmeti aldığımız güvenli servis sağlayıcıları ile,</li>
                <li><strong>Yasal Zorunluluklar:</strong> İlgili mevzuat uyarınca adli ve idari kamu kurumlarının yetkili talepleri doğrultusunda resmi makamlarla paylaşılabilecektir.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="yurtdisi" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Lock size={20} /></span>
                <h2 className="kvkk-section-title">5. Kişisel Verilerin Yurtdışına Aktarılması</h2>
              </div>
              <p className="kvkk-body-text">
                Topluluğumuzun anlık iletişimi, etkinlik duyuruları ve kod paylaşımı amacıyla kullandığı üçüncü taraf dijital platformların
                (özellikle <strong>WhatsApp / Meta Platforms Inc.</strong>, <strong>GitHub Inc.</strong> ve sunucu altyapılarının)
                veri merkezleri ve sunucuları yurt dışında yer alabilmektedir.
              </p>
              <p className="kvkk-body-text">
                Bu platformlara kendi isteğinizle katılmanız, bağlantı linklerini kullanmanız veya açık kaynak depolarımıza katkı sunmanız halinde,
                verileriniz ilgili servislerin küresel gizlilik politikaları çerçevesinde yurt dışındaki sunucular üzerinden işlenmektedir.
              </p>
            </section>

            {/* Section 6 */}
            <section id="hukuki-sebep" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Scale size={20} /></span>
                <h2 className="kvkk-section-title">6. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebepleri</h2>
              </div>
              <p className="kvkk-body-text">
                Kişisel verileriniz; web sitemiz üzerindeki formlar, WhatsApp gruplarımıza katılım doğrulama süreçleri, etkinlik kayıt alanları,
                e-posta yazışmaları ve etkinlik ortamlarındaki sözlü/görsel temaslar aracılığıyla toplanır.
              </p>
              <p className="kvkk-body-text">
                Bu toplama süreci, KVKK’nın 5. ve 6. maddelerinde belirtilen:
              </p>
              <ul className="kvkk-bullet-list">
                <li>İlgili kişinin <strong>açık rızasının</strong> bulunması,</li>
                <li>Topluluk üyeliği, etkinlik katılımı ve sözleşmenin kurulması veya ifası için zorunlu olması,</li>
                <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, topluluğumuzun tanıtımı ve güvenliğinin sağlanması için <strong>meşru menfaatlerimizin</strong> gerektirmesi
                hukuki sebeplerine dayanmaktadır.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="fikri-mulkiyet" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Code2 size={20} /></span>
                <h2 className="kvkk-section-title">7. Fikri ve Sınai Mülkiyet Hakları</h2>
              </div>
              <p className="kvkk-body-text">
                Localhost Uşak platformlarında (<Link to="/projeler" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>/projeler</Link> sayfası),
                hackathon'larda veya etkinlik sunumlarında sergilenen tüm yazılım projelerinin, fikirlerin, kaynak kodlarının ve tasarımların:
              </p>

              <div className="kvkk-callout-box ip-highlight">
                <div className="kvkk-callout-title">
                  <ShieldCheck size={18} style={{ color: 'var(--accent-blue)' }} />
                  <span>{settings?.callouts?.intellectualPropertyTitle || 'Fikri Mülkiyet Teminatı: Kodlar ve Projeler Geliştiriciye Aittir'}</span>
                </div>
                <p className="kvkk-callout-text">
                  {settings?.callouts?.intellectualPropertyText || (
                    <>
                      Projelerin tüm fikri ve sınai mülkiyet hakları, münhasıran projeyi üreten geliştiriciye, ekibe veya ilgili açık kaynak lisansına aittir.
                      Localhost Uşak; paylaşılan projeleri topluluk vitrininde, web sitesinde, haber bültenlerinde ve sosyal medyada sahibini açıkça belirterek
                      <strong> bedelsiz olarak tanıtma, sergileme ve yayınlama hakkına</strong> sahiptir.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="saklama-guvenlik" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Clock size={20} /></span>
                <h2 className="kvkk-section-title">8. Verilerin Saklanma Süresi ve Güvenliği</h2>
              </div>
              <p className="kvkk-body-text">
                Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve mevzuattaki zamanaşımı süreleri dikkate alınarak saklanır.
                Amacın ortadan kalkması veya yasal saklama sürelerinin dolması halinde veriler resen ya da talebiniz üzerine silinir, yok edilir
                veya anonim hale getirilir.
              </p>
              <p className="kvkk-body-text">
                Verilerinizin yetkisiz erişime, kaybolmaya ve suistimale karşı korunması için modern şifreleme, erişim kısıtlamaları ve sunucu güvenliği
                standartları uygulanmaktadır.
              </p>
            </section>

            {/* Section 9 */}
            <section id="haklar" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Scale size={20} /></span>
                <h2 className="kvkk-section-title">9. KVKK Madde 11 Kapsamındaki Haklarınız</h2>
              </div>
              <p className="kvkk-body-text">
                Kanun’un 11. maddesi uyarınca veri sahibi olarak dilediğiniz zaman Localhost Uşak’a başvurarak:
              </p>
              <ul className="kvkk-bullet-list">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
                <li>Eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
                <li>KVKK ve ilgili mevzuata uygun olarak verilerinizin silinmesini veya yok edilmesini talep etme,</li>
                <li>Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme
                haklarına sahipsiniz.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="basvuru" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Mail size={20} /></span>
                <h2 className="kvkk-section-title">10. İletişim ve Başvuru Usulü</h2>
              </div>
              <p className="kvkk-body-text">
                Yukarıda sıralanan haklarınıza ilişkin taleplerinizi; kimliğinizi teyit eden belgelerle birlikte topluluğumuzun resmi iletişim e-posta adresi
                olan <strong><a href={`mailto:${contactEmail}`} style={{ color: 'var(--accent-primary)' }}>{contactEmail}</a></strong> adresine
                iletebilirsiniz.
              </p>
              <p className="kvkk-body-text">
                Başvurularınız incelenerek, talebin niteliğine göre en kısa sürede ve en geç <strong>30 (otuz) gün</strong> içinde ücretsiz olarak
                sonuçlandırılacaktır.
              </p>
            </section>

            {/* Section 11: Muvafakatname / Consent Box */}
            <section id="muvafakatname" className="kvkk-section">
              <div className="kvkk-section-header">
                <span className="kvkk-section-icon"><Check size={20} /></span>
                <h2 className="kvkk-section-title">11. Açık Rıza ve Muvafakat Beyanı</h2>
              </div>
              <p className="kvkk-body-text">
                Topluluğumuza katılırken, WhatsApp gruplarımıza dahil olurken veya etkinliklerimize iştirak ederken onayladığınız genel beyan metni:
              </p>

              <div className="kvkk-consent-box">
                <div className="kvkk-consent-badge">
                  <ShieldCheck size={16} />
                  <span>{settings?.consent?.badge || 'ETKİNLİK VE TOPLULUK MUVAFAKATNAMESİ'}</span>
                </div>

                <blockquote className="kvkk-consent-quote">
                  "{declarationText}"
                </blockquote>

                <div className="kvkk-consent-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>Onay Tarihi: <strong>{settings?.consent?.dateNote || 'Etkinlik / Grup Katılım Anı'}</strong></span>
                    <span>•</span>
                    <span>Veri Sorumlusu: <strong>{settings?.consent?.dataControllerName || 'Localhost Uşak'}</strong></span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
                    onClick={handleCopyDeclaration}
                  >
                    {copied ? <Check size={14} style={{ color: 'var(--accent-success)' }} /> : <Copy size={14} />}
                    <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                  </button>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
};

export default KvkkPage;
