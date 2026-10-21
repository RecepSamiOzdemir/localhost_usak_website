# localhostusak SEO

Bu dal teknik SEO ve görünür içerik düzenlemelerini içerir. Sıralama veya Google'da ilk sıra garantisi vermez.

## Uygulananlar

- Ana sayfa: Uşak teknoloji, yazılım ve mühendislik topluluğu hakkında görünür içerik ve ilgili sayfalara bağlantılar.
- Etkinlikler: Uşak coworking ve teknoloji buluşmaları.
- Kariyer: Uşak yazılım iş ilanları, staj ve kariyer paylaşımları.
- Projeler: Uşak yazılım projeleri ve açık kaynak.
- `/en/`: İngilizce topluluk tanıtımı; Usak/Uşak technology community, developers, engineers ve coworking konularını doğal metinle açıklar. Diğer sayfaların tam çevirisi olmadığı için siteye yanıltıcı hreflang etiketleri eklenmedi.
- Sayfaya özel canonical, dil, başlık, açıklama, Open Graph ve Twitter etiketleri. Arama/filtre parametreleri canonical'a dahil edilmez.
- Organization, WebSite ve WebPage/CollectionPage JSON-LD. Gerçek ilan/etkinlik ayrıntı sayfaları olmadığı için JobPosting/Event işaretlemesi eklenmedi.
- Build, her bilinen rota için ayrı `dist/<rota>/index.html` ve sitemap üretir. Nginx'in dosya/dizin servis etmesiyle uyumlu trailing-slash canonical kullanılır.
- Yönetim sayfası noindex; bulunamayan React rotası istemci tarafında noindex. SPA fallback nedeniyle bilinmeyen URL'lerin HTTP 404 yanıtı ayrıca hosting seviyesinde düzenlenmelidir.

## Sınırlar ve içerik yönetimi

Bu işlem tam SSR/prerender değildir: ilk HTML'de meta ve yapılandırılmış veriler bulunur; React içeriği ve CMS koleksiyonları JavaScript ile yüklenir. Eski şablonun birebir eşleşen SEO varsayılanları frontend’de yeni metinlere dönüştürülür; özel CMS başlık/açıklama değişiklikleri tarayıcıda önceliklidir; paylaşım botlarının gördüğü ilk HTML varsayılanları `src/seo/pages.json` içinden build sırasında üretilir. Bu iki kaynağı uyumlu tutun; dinamik sosyal önizleme için ileride CMS verisiyle prerender/SSR gerekir.

Boş kariyer veya etkinlik sayfaları sırf anahtar kelimeyle rekabet edemez. Gerçek etkinlik duyuruları ve özetleri, özgün Uşak yazılım projeleri ve güncel iş/staj ilanları yayınlayın. Süresi biten ilanları kapatın. Gerçekte sunulmayan ofis, kurs, iş veya hizmetleri SEO metnine eklemeyin.

## Yayın sonrası

1. Branch'i yerelde test edip PR ile `main`'e birleştirin; Coolify dağıtımı tamamlandığında `/`, `/etkinlikler/`, `/kariyer/`, `/projeler/`, `/sponsorlar/` için HTML ve canonical'ı kontrol edin.
2. Google Search Console'da `localhostusak.com` Domain mülkünü doğrulayın. Google'ın verdiği TXT değerini DNS'e eklemek gerekir; bu çalışma hesap doğrulaması yapmaz.
3. `https://localhostusak.com/sitemap.xml` adresini Search Console'a gönderin. URL Denetleme ile ana sayfa ve önemli sayfalarda canlı test yapın.
4. Rich Results Test ile yapılandırılmış veriyi kontrol edin. Geçerli schema, zengin sonuç veya sıralama garantisi değildir.
5. Search Console Performans raporunda Türkçe/İngilizce sorguları, gösterim, tıklama ve sayfa bazındaki gelişimi takip edin. Yerel topluluk/üniversite/etkinlik iş birliklerinden gerçek, ilgili bağlantılar kazanın.

Kontrol: `npm run build:web` ardından `npm --prefix localhostusak-web run check:seo`.

Google kaynakları:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/special-tags
