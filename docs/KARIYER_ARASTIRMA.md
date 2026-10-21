# Kariyer Bölümü & Güvenli CV Havuzu (FAZ 6) — Araştırma ve Analiz

- **Tarih:** 5 Ekim 2026
- **Kapsam:** Yalnızca okuma/analiz. Kod, migration, paket kurulumu, git işlemi ve canlı ortama erişim yapılmadı. Tek yazılan dosya bu rapordur.
- **Okunan kaynaklar:** `ROADMAP.md`, `ENVIRONMENTS.md`, `deploy/*`, `localhostusak-cms/src/**`, `localhostusak-web/src/**`, `node_modules/payload/dist/uploads/**` (Payload 3.90.1 kaynak kodu).
- **Gizli dosyalar:** `.env*` dosyalarının değerleri okunmadı/yazılmadı; yalnızca değişken **isimleri** listelendi (§3.7).
- **İşaretleme:** Doğrulanamayan her şey **VARSAYIM** olarak etiketlidir. Dış kaynaklar §10'da listelidir.

---

## 1. Özet

1. FAZ 6'nın istediği `JobApplications` koleksiyonu, CV upload'ı, KVKK onaylı form ve virüs taraması **repoda yok**. Sıfırdan yapılacak.
2. Repoda **zaten** bir `careers` koleksiyonu (iş *ilanları*), `careers-page-settings` global'i ve `/kariyer` sayfası var. FAZ 6 bunlara dokunmadan **yanına** eklenebilir (yeni koleksiyon + yeni form bileşeni).
3. **CV'ler `Media` koleksiyonuna konamaz.** `Media.read = () => true` ve Payload dosya servisi koleksiyonun `read` kuralını kullanır → CV herkese açık olur. Ayrı, admin-only bir upload koleksiyonu gerekir.
4. Formun herkese açık olması `create: () => true` anlamına gelmemeli. Bunun yerine `Projects.ts`'teki `/:id/like` kalıbıyla **özel endpoint** önerilir (honeypot, rate limit, PDF doğrulama, tarama, sonra Local API ile kayıt).
5. Payload 3.90.1 zaten magic-byte (`file-type`) + `validatePDF` kontrolü yapıyor; `mimeTypes: ['application/pdf']` yeterli. Yeni paket gerekmez. 5 MB limiti **koleksiyon bazında** uygulanmalı (global limit `Media`'yı da etkiler).
6. Projede **rol yok**: giriş yapmış her `Users` kaydı her CV'yi okuyabilir. Rol eklemek en yüksek kırılma riski taşıyan değişikliktir → Açık Soru.
7. Virüs taraması: ClamAV en güçlü seçenek ama 3–4 GiB RAM ister (**VARSAYIM:** sunucu yeterli); VirusTotal CV'ler için pratikte uygun değil (üçüncü tarafa aktarım + ücretsiz API ticari kullanıma kapalı); PDF aktif içerik taraması tek başına yetersiz, ClamAV'ın **tamamlayıcısı** olarak değerli.
8. Kalıcı depolama belirsiz: Coolify'da yüklemeler için volume yoksa her deploy'da dosyalar silinir (§5.5). `backup-db.sh` yalnızca veritabanını yedekler.
9. Bilinen karar ("CV'ler elle silinene kadar kalır") sitenin kendi KVKK metniyle (§8: "amaç ortadan kalkınca silinir") ve Kurul kararı 2021/670 ile **gerilim** yaratıyor. Hukuki tavsiye değil; teknik azaltma önerileri §6'da, karar §8'de.
10. Migration production'da açılışta otomatik çalışır (`prodMigrations`); `main`'e birleştirme canlıyı etkiler.

---

## 2. ROADMAP'teki ilgili maddeler (birebir alıntı)

### 2.1 Öncelik listesi (`ROADMAP.md` satır 65)

> `[ÖNCELİK 6] Kariyer Sayfası & Güvenli CV Havuzu (CV Upload & Virus Scan)`

### 2.2 FAZ 6 bölümü (`ROADMAP.md` satır 192–220)

```
## 📄 FAZ 6: Kariyer Sayfası & Güvenli CV Havuzu (Öncelik: P3)

### 📋 Amaç:
Topluluk üyelerinin staj, iş veya mentorluk fırsatları için güvenli bir şekilde CV yükleyebileceği bir yetenek havuzu oluşturmak.

### 🛡️ Güvenlik Gereksinimleri (Çok Kritik):
Dosya yükleme alanları sunucular için en büyük saldırı vektörlerinden biridir. Bu nedenle güvenlik katı tutulmalıdır:
1. **MIME Type & Magic Byte Kontrolü:** Yalnızca gerçek `.pdf` dosyaları kabul edilmeli; dosya uzantısını `.pdf` yapıp içine zararlı script koyan dosyalar sunucu tarafında *magic number* (`%PDF-`) kontrolü ile reddedilmeli.
2. **Dosya Boyutu Limiti:** Maksimum **5 MB**.
3. **Dosya Adı Sanitizasyonu:** Yüklenen dosya adı random UUID veya timestamp ile değiştirilerek sunucuya kaydedilmeli (örn: `cv_8f7b2a_1727318400.pdf`).
4. **Virüs / Zararlı Yazılım Taraması:**
   - *Yöntem:* Yükleme anında dosya izole bir `tmp/` alanına alınmalı.
   - ClamAV container'ı üzerinden tarama yapılmalı VEYA VirusTotal / FileScan API ile taranıp temiz olduğu doğrulanmalıdır.
   - Eğer zararlı içerik bulunursa dosya derhal silinmeli ve `400 Bad Request / Güvenlik Uyarısı` dönülmelidir.
5. **Erişim Kısıtlaması (Private Storage):**
   - Yüklenen CV dosyaları public internete **ASLA doğrudan açık olmamalıdır**.
   - Yalnızca Payload CMS üzerinde oturum açmış yöneticiler indirebilmeli (`access.read: ({ req: { user } }) => Boolean(user)`).

### 🛠️ Yapılacaklar:
1. **CMS Modeli:** `localhostusak-cms/src/collections/JobApplications.ts`
   - `candidateName`: Ad Soyad
   - `email`, `phone`, `linkedinUrl`, `githubUrl`
   - `experienceLevel`: Junior, Mid, Senior, Stajyer/Öğrenci
   - `fieldsOfInterest`: Frontend, Backend, Mobile, DevOps, UI/UX vb.
   - `cvFile`: Güvenli dosya upload alanı
   - `status`: `new` (Yeni), `reviewed` (İncelendi), `contacted` (İletişime Geçildi), `archived` (Arşivlendi)
   - `notes`: Yöneticilerin aday hakkında aldığı özel notlar
2. **Frontend UI:**
   - [CareersPage.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/pages/CareersPage.tsx) üzerinde sürükle-bırak (Drag & Drop) destekli, KVKK onay kutulu modern başvuru formu.
```

### 2.3 FAZ 6'yı doğrudan kısıtlayan genel standartlar (`ROADMAP.md` §3, satır 249–262)

> `1. CSS ve Tasarım Kuralları: Harici CSS framework (Tailwind vb.) kurulmamalıdır. Projenin mevcut design token'ları (var(--accent), var(--bg-primary), var(--font-mono) vb.) ve components.css kullanılmalıdır. Pixel/Modern tema uyumluluğuna dikkat edilmelidir.`
>
> `2. Git İş Akışı: Geliştirmeler new_era_w_yusuf dalı üzerinde yapılmalıdır. Commit önekleri: feat(web), feat(cms), fix(web), style(web).`
>
> `3. Canlı Ortam Duyarlılığı: CMS üzerinde veritabanı şeması değiştirildiğinde migration üretilmeli veya production veritabanı ile uyum gözetilmelidir. Environment variable'lar .env.example dosyalarına işlenmelidir.`

(Satır içi alıntılar kısaltılmıştır; tam metin `ROADMAP.md` satır 249–262'dedir.)

### 2.4 Diğer fazlara bağımlılık

| Bağımlılık | Durum |
|---|---|
| Auth / kullanıcı rolleri | FAZ 6 metni "oturum açmış yöneticiler" der; rol şeması **tanımlamaz**. Mevcut `Users` rolsüz (§3.3). Başka bir faza bağlı değil ama **gizli bir bağımlılık** var. |
| Dosya yükleme altyapısı | Başka faz sağlamıyor. Yalnızca `Media` var ve **public** (§3.4). FAZ 4 (`TeamMembers.avatar`) ve etkinlik kapakları `Media`'yı kullanıyor. |
| E-posta | ROADMAP'te bildirim/e-posta maddesi **yok**. Payload'da e-posta adapter'ı yapılandırılmamış (`payload.config.ts`'te `email` yok) → **VARSAYIM:** şu an hiçbir e-posta gönderilmiyor. |
| FAZ 7 (Topluluk Sesleri) | Aynı "herkese açık POST + honeypot + rate limit" ihtiyacını paylaşıyor → ortak yardımcı (§7). |
| KVKK global'i | Mevcut `kvkk-settings` ve `/kvkk` sayfası CV işlemeyi **kapsamıyor** (§6). |

### 2.5 ROADMAP'te belirsiz / yoruma açık noktalar

1. **"Güvenli dosya upload alanı"** (`cvFile`): ilişki mi (ayrı upload koleksiyonu), yoksa `JobApplications`'ın kendisi mi upload koleksiyonu? Belirtilmemiş.
2. **Kim başvurur?** Amaç "topluluk üyeleri" diyor ama giriş/üyelik sistemi yok; form anonim mi, hesap gerektirir mi? Metin anonim form ima ediyor (KVKK onay kutulu form).
3. **"Yetenek havuzu" mu, "ilana başvuru" mu?** Model ilana referans içermiyor (`careers` ilişkisi yok). Havuz = genel başvuru; ilana özgü başvuru istenirse `jobId` alanı gerekir.
4. **Mevcut `careers` (ilan) koleksiyonu** ROADMAP'te hiç anılmıyor; "Kariyer Sayfası" kapsamında yeniden yazılacak mı, korunacak mı?
5. **`experienceLevel` ve `fieldsOfInterest` değerleri** ("vb." diye açık uçlu); tek seçim mi çoklu mu (`fieldsOfInterest` çoğul → çoklu varsayıldı, **VARSAYIM**).
6. **"Yalnızca .pdf":** DOCX/görsel CV'ler kapalı mı? Metin evet diyor ama kullanıcı etkisi (öğrenciler çoğu kez Word/Canva çıktısı kullanır) değerlendirilmemiş.
7. **"İzole `tmp/` alanı"**: Payload bellekte (buffer) tutuyor, `useTempFiles: false` (§3.4). `tmp/` gerçekten şart mı yoksa bellek içi tarama yeterli mi?
8. **VirusTotal / FileScan** seçeneği KVKK yurt dışı aktarım boyutunu hiç ele almıyor (§5).
9. **"400 Bad Request / Güvenlik Uyarısı"**: Kullanıcıya zararlı bulgunun *detayı* gösterilmemeli; mesaj içeriği tanımsız.
10. **Başvuru sonrası bildirim**: Adaya onay e-postası / ekibe bildirim isteniyor mu? Metinde yok.
11. **Saklama/silme** ve **erişim logu** ROADMAP'te hiç yok (yalnızca "otomatik silinmeyecek" kararı sözlü iletildi).
12. ROADMAP'teki yazılım sürümleri güncel değil (§3.1) ve dosya linkleri başka bir makinenin mutlak yolu (`/Users/ademaldemir/...`).

---

## 3. Mevcut proje yapısı — kariyer bölümünü ilgilendiren kısımlar

### 3.1 Genel mimari

| Katman | Gerçek durum (kaynak: `package.json` dosyaları) | ROADMAP iddiası |
|---|---|---|
| CMS | Payload **3.90.1**, Next **16.3.3**, React 19.2.6, `@payloadcms/db-postgres` 3.90.1, sharp 0.35.4 (`localhostusak-cms/package.json`) | "Next.js 15" |
| Web | React **19**, Vite 6, react-router-dom 7, lucide-react; **form/state kütüphanesi yok** (`localhostusak-web/package.json`) | "React 18" |
| Dağıtım | Coolify + Railpack (`ENVIRONMENTS.md`); `main` merge → otomatik deploy | doğru |
| Eski dağıtım rehberi | `deploy/DEPLOYMENT_GUIDE.md` (PM2 + nginx + Keybuu VPS 12 GB) ve `localhostusak-cms/Dockerfile` (`output: 'standalone'` gerektirir, `next.config.ts`'te **yok**) — **eskimiş görünüyor** | – |

Monorepo: kök `package.json` yalnızca `--prefix` komutları içerir. CMS API kökü: `…/api`; web `VITE_API_URL` ile CMS'e bağlanır (cross-origin; `payload.config.ts` `cors` listesi `localhostusak.com/.tech`, `localhost:5173` vb. içerir).

> Tutarsızlık: `ENVIRONMENTS.md` prod API'yi `https://cms.localhostusak.tech/api`, `localhostusak-web/.env.production.example` ise `https://cms.localhostusak.com/api` gösteriyor. Hangisi canlı? (Açık Soru.)

### 3.2 Payload yapılandırması (`localhostusak-cms/src/payload.config.ts`)

- Koleksiyonlar: `Users, Media, EventTypes, Events, Careers, Projects, Sponsors, TeamMembers, CommunityLinks`.
- Global'ler: `GeneralSettings, SiteSettings, EventsPageSettings, CareersPageSettings, ProjectsPageSettings, KvkkSettings`.
- `db: postgresAdapter({ pool, prodMigrations: migrations })` → production'da migration'lar **açılışta** çalışır.
- `upload` (global fetch/busboy ayarı) **tanımlı değil** → Payload varsayılanı: dosya başına **20 MiB**, istek başına 50 MiB (Payload upload docs; `fetchAPI-multipart/index.js` satır 16'da 20 MiB doğrulandı).
- `email` adapter yok, `plugins: []` (S3/bulut depolama yok).
- `cors` açık liste; `csrf` tanımsız (cookie auth admin için; form endpoint'i anonim olacağı için CSRF doğrudan sorun değil, **VARSAYIM**).

### 3.3 Mevcut koleksiyonlar, erişim kalıpları, hook'lar

Erişim kalıbı tüm koleksiyonlarda aynı: `read: () => true`, `create/update/delete: ({ req: { user } }) => Boolean(user)` (örn. `Careers.ts` satır 9–14, `TeamMembers.ts` satır 9–14, `Media.ts` satır 5–10).

| Dosya | Not |
|---|---|
| `src/collections/Users.ts` | `auth: true`, **hiç ek alan yok** → rol yok. "Giriş yapmış kullanıcı" = tam yetkili. |
| `src/collections/Media.ts` | `upload: true`, `read: () => true`; `mimeTypes`/`staticDir` yok. |
| `src/collections/Careers.ts` | **İş ilanı** modeli: `title, company, type(job/internship/freelance/mentorship), workMode, schedule, technologies[], description, applyUrl, contact, postedBy, isActive, expiresAt`. `applyUrl` dış link/e-posta. |
| `src/globals/CareersPageSettings.ts` | Hero, WhatsApp CTA, `careerResources[]`, SEO `meta`. Form metni alanı **yok**. |
| `src/globals/KvkkSettings.ts` | Hero, `documentMeta`, `leadText`, `callouts`, `consent` (etkinlik/fotoğraf odaklı), `sections[]`. CV'ye özel metin yok. |
| `src/collections/Projects.ts` satır 1–25, 40–95 | **Tek "herkese açık yazma" örneği:** `PATCH /api/projects/:id/like` özel endpoint'i; bellek içi `Map` ile IP+ID rate limit (`x-forwarded-for`'a güvenir); `req.payload.update` çağrısı `overrideAccess` vermediği için Local API varsayılanıyla **erişimi atlar**. Bellek tabanlı olduğu için redeploy'da sıfırlanır ve çoklu süreçte paylaşılmaz. |
| `src/app/api/instagram/posts/route.ts` | Next route handler örneği (CORS beyaz listesi, 15 dk bellek cache). |
| Hook kullanımı | Koleksiyonlarda `hooks:` **hiç kullanılmamış**. `endpoints:` yalnızca `Projects`'te. |

### 3.4 Dosya yükleme altyapısı (Payload 3.90.1 kaynak koduyla doğrulandı)

- Depolama: **yerel disk.** `staticDir` verilmezse klasör adı koleksiyon slug'ı (`getFile.js`: `collection.config.upload?.staticDir || collection.config.slug`, `path.resolve` ile çalışma dizinine göre). `Media` → `localhostusak-cms/media/` (`.gitignore`'da `/media`). Bulut adapter'ı yok.
- Dosya servisi: `GET /api/<slug>/file/<filename>`. `checkFileAccess.js` koleksiyonun `access.read` kuralını **çalıştırır** (`isReadingStaticFile: true`). Yani `read` kısıtlanırsa dosya da kısıtlanır — ROADMAP'in `Boolean(user)` önerisi dosya düzeyinde gerçekten işler. `Media`'da `read: () => true` olduğu için orada her şey açık.
- Tür doğrulama (`uploads/checkFileRestrictions.js`): `file-type` ile **buffer'dan magic-byte tespiti**; `mimeTypes` verilirse tespit edilen MIME listeyle karşılaştırılır; PDF ise `validatePDF` (`utilities/validatePDF.js`): başlık `%PDF-` + son 1024 baytta `%%EOF` ve `xref` içermeli. `mimeTypes` verilmezse yalnızca çalıştırılabilir/script uzantıları engellenir (PDF olmayan her şey geçebilir).
  - Dikkat: `validatePDF` son 1 KB'a bakar; sonunda >1 KB çöp/ek veri olan bazı PDF'ler **yanlış reddedilebilir**. Word, Google Docs, Canva, LaTeX çıktılarıyla test edilmeli.
- Boyut: global `upload.limits.fileSize` (varsayılan 20 MiB) tüm koleksiyonlara uygulanır. **5 MB'ı global yapmak `Media`'yı da kısıtlar** → 5 MB koleksiyon hook'unda/endpoint'te uygulanmalı (istek geldikten sonra; bellekte tamponlanır, bu yüzden global üst sınır yine de makul bir değere çekilebilir, §7).
- Dosya adı: Payload özgün adı sanitize eder ama **korur** (çakışmada sayaç ekler). Aday adı içeren `Ahmet_Yilmaz_CV.pdf` diskte ve URL'de kalır → ROADMAP madde 3 için ek **yeniden adlandırma** gerekir (`beforeOperation`/`beforeValidate` hook'u; tam yöntem uygulama aşamasında doğrulanmalı, **VARSAYIM:** `req.file.name` değiştirilebilir).
- Yanıt başlıkları: koleksiyon `upload.modifyResponseHeaders` ve `upload.handlers` destekliyor (`getFile.js`). `handlers` dosya akıtılmadan önce çalışır → **indirme logu** için doğru nokta. `Content-Disposition: attachment` ve `X-Content-Type-Options: nosniff` `modifyResponseHeaders` ile eklenebilir.
- Silme: `deleteAssociatedFiles` mevcut → belge silinince dosyası da diskten silinir (davranış uygulamada test edilmeli).
- REST oluşturma: `POST /api/<slug>` multipart (`file` + `_payload`). Local API: `payload.create({ collection, data, file })` (`create.d.ts` satır 42: `file?: File`; `filePath?` de var).
- Bellek: `useTempFiles: false` → yüklemeler bellekte tamponlanır; ROADMAP'in "izole `tmp/`" ifadesi Payload varsayılanıyla birebir örtüşmez.

### 3.5 Frontend (`localhostusak-web`)

| Konu | Mevcut |
|---|---|
| Route | `src/App.tsx` satır 91–101: `/`, `/etkinlikler`, `/kariyer`, `/projeler`, `/sponsorlar`, `/kvkk`, `/kvkk-aydinlatma-metni`, `/admin` (CMS admin'e yönlendirir), `*`. |
| Kariyer sayfası | `src/pages/CareersPage.tsx` (139 satır): ilan listesi, `FilterBar`, `CareerResources`, `PageHero`; ayarlar `fetchCareersPageSettings`. **Başvuru formu yok.** |
| Bileşenler | `src/components/careers/CareerCard.tsx`, `CareerResources.tsx`, `CareerCTA.tsx` (**hiçbir yerden import edilmiyor** — ölü bileşen). |
| Veri katmanı | `src/services/api.ts`: `API_BASE = VITE_API_URL || '/api'`, `fetchCareers`, `fetchCareersPageSettings` (modül içi önbellekli), `likeProject` (tek yazma isteği, JSON). **Çok parçalı (multipart) POST örneği yok.** `src/hooks/useCmsCollection.ts` liste çekme hook'u. |
| Form/UI kalıpları | Yok denecek kadar az: `.form-group` / `.form-control` (`styles/subpages.css` satır 536–562, admin benzeri), `FilterBar.tsx` arama `<input>`'u, onay kutusu kalıbı `WhatsAppRulesModal.tsx` (satır 280–310, `.wa-rules-checkbox-*` sınıfları, "sonuna kadar kaydır → kutu açılır" mantığı). **Drag&drop, dosya input'u, form doğrulama yok.** |
| Stil | Vanilla CSS token'ları: `styles/tokens.css`, `components.css` (1658 satır), `subpages.css`, `glassmorphism-theme.css`; Tailwind yok. Pixel/Modern tema. |
| Auth yardımcıları | `src/utils/auth.ts` (`getAuthHeaders`, token localStorage) — **hiçbir yerde kullanılmıyor**; yeniden kullanmak gerekmez, adayın girişi yok. |
| SEO | `src/seo/pages.json` → `/kariyer` kaydı var; `scripts/build-seo.mjs` ve `check-seo.mjs` bu dosyayı okur. Formun yeni bir route'u olursa kayıt eklenmeli (aynı sayfada kalırsa gerekmez). |
| KVKK sayfası | `src/pages/KvkkPage.tsx` (515 satır): bölüm 2 "Mesleki, Eğitim ve Portfolyo Bilgileri" (kariyer panosunu anıyor) — **CV/özgeçmiş dosyası, saklama süresi, yurtdışı aktarım detayı yok**; bölüm 8 saklama genel ifade. CMS'ten gelen `sections` kısmen kullanılıyor, çoğu metin JSX içinde sabit. |

### 3.6 Yeniden kullanılabilir parçalar (kariyer bölümü için)

| Parça | Yol | Nasıl |
|---|---|---|
| Herkese açık özel endpoint kalıbı | `localhostusak-cms/src/collections/Projects.ts` (endpoints + rate limit + `getHeader` ip çıkarımı) | Başvuru endpoint'ine temel; ancak bellek-içi `Map` ortak util'e taşınmalı (§7). |
| Erişim kalıbı | tüm `collections/*.ts` | `create/update/delete: Boolean(user)` aynen. |
| Global ayar kalıbı | `globals/CareersPageSettings.ts` | Form başlığı, açıklama, onay metni, başarı mesajı alanları için grup eklenebilir. |
| Sayfa iskeleti | `pages/CareersPage.tsx`, `PageHero`, `EmptyState`, `Badge` | Form bölümü bu sayfaya eklenir (yeni route gerekmez). |
| Onay kutusu stilleri | `components/shared/WhatsAppRulesModal.tsx` + `styles/whatsapp-rules-modal.css` | KVKK onayı için görsel dil; mantık yeniden yazılmalı. |
| Form stilleri | `styles/subpages.css` `.form-group/.form-control` | Genişletilerek kullanılır (yeni CSS framework yok). |
| Veri katmanı | `services/api.ts` | `submitJobApplication()` buraya eklenir (`API_BASE` + `FormData`). |
| Sayfa meta/SEO | `hooks/usePageMeta.ts`, `seo/pages.json` | Değişiklik gerekmez. |
| Dosya doğrulama | Payload yerleşik (`mimeTypes`, `validatePDF`) | Elle magic-byte kodu yazmaya gerek yok; yalnızca davranışı test et. |

### 3.7 Ortam değişkenleri (yalnızca isimler)

- CMS: `DATABASE_URL`, `PAYLOAD_SECRET`, `PORT` (+ `NODE_ENV` production), isteğe bağlı kodda okunan `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `WEB_URL` (`app/api/instagram/posts/route.ts`).
- Web: `VITE_API_URL` (build-time, tarayıcıya gömülür; kamuya açık olması tasarımı gereği normal).
- FAZ 6 için **muhtemel yeni** CMS değişkenleri (hepsi gizli, `NEXT_PUBLIC_` **almaz**): ClamAV host/port (örn. `CLAMAV_HOST`, `CLAMAV_PORT`), tarama zorunlu/isteğe bağlı bayrağı, isteğe bağlı IP hash tuzu. `.env.example` + `.env.production.example` + Coolify güncellenmeli.

### 3.8 Migration ve test altyapısı

- Migration'lar: `src/migrations/` (6 adet; son: `20260930_092130_add_project_status_difficulty_and_contributing_url`). `index.ts` elle/üretimle güncelleniyor.
- Geçmişte şema kayması yaşanmış: `20260928_192652_reconcile_schema_drift` (kvkk_settings, vision_messages…). Dev'de Payload şemayı otomatik güncelleyebildiği için (`ENVIRONMENTS.md`) yeni migration üretmeden önce yerel DB'de `migrate:status` temiz olmalı.
- Testler: `tests/int/api.int.spec.ts` (vitest), `tests/e2e/*.spec.ts` (playwright). `careers` için test **yok**.
- Seed (`src/seed.ts`): `careers`, `careers-page-settings` vs. dolduruyor ve global'leri koşulsuz `updateGlobal` ile **üzerine yazıyor**. Proje hafızası: canlıda asla çalıştırılmaz. Yeni global alanları seed'e eklenirse aynı risk geçerli.

---

## 4. Önerilen veri modeli ve erişim kuralları

> Renk kodu: **[ROADMAP]** = ROADMAP'te açıkça var, **[ÖNERİ]** = bu raporun önerisi.

### 4.1 `job-applications` koleksiyonu

**Seçenek A (önerilen): tek koleksiyon, `upload: true`.** Başvuru kaydı ve CV dosyası aynı belge.
**Seçenek B: iki koleksiyon** (`job-applications` + `cv-files` upload koleksiyonu, `cvFile` ilişkisi). ROADMAP'in "`cvFile`: güvenli dosya upload alanı" ifadesine daha yakın.

| | A (tek, upload) | B (iki koleksiyon) |
|---|---|---|
| Dosya erişim kuralı | Aynı koleksiyonun `read`'i hem kaydı hem dosyayı korur | Her iki koleksiyonda ayrı `read: Boolean(user)` unutulmamalı |
| Silme | Kayıt silinince dosya da silinir (tek adım) | İki adım; yetim dosya riski |
| Create başarısız olursa yetim dosya | Yok (atomik) | Var (önce dosya, sonra kayıt) |
| ROADMAP'e sadakat | Alan adı `cvFile` yerine `filename` olur | `cvFile` birebir |
| Admin panelinde görünüm | CV, kaydın yanında | İlişki seçici |

**Öneri: A.** Gerekçe: atomiklik, tek erişim kuralı, daha az yüzey. (Karar §8'de.)

Alanlar:

| Alan | Tür | Kaynak | Not |
|---|---|---|---|
| `candidateName` | text, zorunlu | [ROADMAP] | |
| `email` | email, zorunlu | [ROADMAP] | Kişisel veri; liste görünümünde maskelenebilir |
| `phone` | text | [ROADMAP] | İsteğe bağlı öneri (zorunlu mu? ROADMAP belirtmiyor) |
| `linkedinUrl`, `githubUrl` | text/URL | [ROADMAP] | Sunucuda `https:` + alan adı doğrulaması |
| `experienceLevel` | select | [ROADMAP] | Junior, Mid, Senior, Stajyer/Öğrenci |
| `fieldsOfInterest` | select, `hasMany` | [ROADMAP] | Frontend, Backend, Mobile, DevOps, UI/UX vb. |
| `cvFile` | upload (`mimeTypes: ['application/pdf']`) | [ROADMAP] | A seçeneğinde koleksiyonun kendi dosyası |
| `status` | select | [ROADMAP] | `new/reviewed/contacted/archived`, varsayılan `new`; **alan-düzeyi `access.create`: yalnızca admin** |
| `notes` | textarea | [ROADMAP] | **alan-düzeyi `read/update/create`: yalnızca admin**, hiçbir public yanıtta dönmemeli |
| `consentGiven` | checkbox (true zorunlu) | [ÖNERİ] | Sunucuda doğrulanır; yalnız istemci kutusuna güvenilmez |
| `consentAt` | date (sunucu üretir) | [ÖNERİ] | Rızanın zamanı; yaş sütunu/silme önceliği için |
| `consentTextVersion` | text | [ÖNERİ] | Hangi aydınlatma/rıza metnine onay verildi (KvkkSettings sürümü) |
| `scanStatus` / `scanEngine` / `scannedAt` | select/text/date | [ÖNERİ] | `clean` / `skipped` (tarama devre dışıyken) / `error`; reddedilen dosya zaten kaydedilmez |
| `fileSha256` | text | [ÖNERİ] | Tekrar başvuru/kanıt; **VARSAYIM:** gerekli mi, tartışılır |
| `jobId` (ilişki → `careers`) | relationship, opsiyonel | [ÖNERİ] | Yalnızca "ilana başvuru" istenirse (§2.5 madde 3) |
| `reviewDeadline` (bilgilendirme amaçlı) | date | [ÖNERİ] | Otomatik silme **yapmaz**; admin'de "inceleme zamanı geldi" filtresi için (§6) |
| `ipHash` | text | [ÖNERİ] | İsteğe bağlı, kötüye kullanım takibi; ham IP **saklanmaz** (KVKK veri minimizasyonu) |

Kaçınılacaklar: özel nitelikli veri (sağlık, din, fotoğraf, TC kimlik no) için alan açmamak; formda "CV'nde bunlar olmasın" uyarısı (§6).

### 4.2 Erişim kuralları

| İşlem | Kural | Kaynak |
|---|---|---|
| Koleksiyon `read` | `({ req: { user } }) => Boolean(user)` — **hem REST/GraphQL hem dosya servisi** | [ROADMAP] |
| Koleksiyon `create` | `({ req: { user } }) => Boolean(user)` (**public değil**) | [ÖNERİ] |
| `update` / `delete` | `Boolean(user)` | [ÖNERİ] (mevcut kalıpla aynı) |
| Public başvuru | **Özel endpoint** (`POST /api/job-applications/apply`) → doğrulama → `req.payload.create({ ..., overrideAccess: true })` | [ÖNERİ] |
| Alan düzeyi | `status`, `notes`, `scan*` yalnızca admin yazar | [ÖNERİ] |
| GraphQL | `graphQL: false` veya `read` kuralı zaten kapatır; `/api/graphql` varsayılan açık olduğundan koleksiyonu GraphQL'den **ayrıca devre dışı bırakmak** düşünülmeli | [ÖNERİ] (**VARSAYIM:** `graphQL: false` seçeneği bu sürümde mevcut; uygulamada doğrula) |

Neden `create: () => true` değil: açık `create` aynı zamanda `/api/job-applications` REST ve GraphQL üzerinden **herkesin** `status`, `notes` gibi alanları vermesine, rate limit/honeypot/tarama adımlarını atlayıp doğrudan dosya yüklemesine izin verir. Özel endpoint tek giriş noktası olur.

### 4.3 Mevcut `careers` koleksiyonuna dokunmama önerisi

`careers` (ilanlar) ve başvuru (`job-applications`) farklı veri. Mevcut ilan listesi çalışıyor; **ona alan ekleme gerekmiyor**. Yalnızca "ilana başvur" istenirse isteğe bağlı `jobId` ilişkisi başvuru tarafına eklenir (ilan tarafı değişmez).

### 4.4 Rol meselesi

`Users` rolsüz. ROADMAP "oturum açmış yöneticiler" der → mevcut sistemde bu **bütün CMS kullanıcıları** demek. Seçenekler:

| Seçenek | Artı | Eksi |
|---|---|---|
| 1. Rol eklenmeden devam (herkes görür) | Sıfır kırılma riski, ROADMAP'e birebir | CV'leri görmemesi gereken editörler (varsa) görür |
| 2. `Users`'a `role` alanı (`admin`/`editor`) + yalnızca CV koleksiyonunda `role === 'admin'` | Kapsamı dar tutar | `Users` tablosuna sütun (migration), mevcut kullanıcıların rolü atanmalı; **rolü boş kullanıcılar kilitlenmemeli** (varsayılan değer + backfill) |
| 3. Tüm koleksiyonlarda rol bazlı yeniden yazım | Doğru uzun vade | Kapsam dışı, yüksek risk |

**Öneri:** Önce kaç `Users` kaydı olduğunu ve herkesin CV görmesinin sorun olup olmadığını öğren (§8). Sorun yoksa 1; varsa 2 (yalnızca yeni koleksiyonu etkileyecek şekilde). 3 önerilmez.

---

## 5. CV yükleme, saklama ve virüs taraması seçenekleri

### 5.1 Katmanlı doğrulama (önerilen akış, karar değil)

1. İstemci: yalnızca UX (uzantı, 5 MB, sürükle-bırak). **Güvenlik sayılmaz.**
2. Endpoint: honeypot → rate limit → alan doğrulama → rıza doğrulama → boyut (≤ 5 MB) → Payload `mimeTypes` + `validatePDF` (magic byte) → (opsiyonel) PDF aktif içerik taraması → (opsiyonel) ClamAV → dosya adı UUID/timestamp → `payload.create`.
3. Tarama temiz değilse **kayıt oluşturulmaz**, genel mesajla `400` döner (bulgu detayı verilmez).
4. Bellek içi tamponlama yüzünden eşzamanlı büyük istekler RAM tüketebilir → global `upload.limits.fileSize`/`requestSizeLimit` makul üst sınıra çekilmeli (ancak `Media` etkisi kontrol edilmeli).

### 5.2 Virüs/zararlı tarama seçenekleri — karşılaştırma

> Karar verilmedi; yalnızca artı/eksi.

| Kriter | A. ClamAV (clamd, ayrı container) | B. VirusTotal (public API) | C. Diğer harici tarama API'leri (FileScan vb.) | D. PDF aktif içerik kontrolü (JS/OpenAction/Launch anahtar kelime taraması, uygulama içinde) | E. Hiç tarama yok (yalnızca magic byte + `validatePDF`) |
|---|---|---|---|---|---|
| Ne yakalar | İmza tabanlı bilinen zararlılar | 70+ motorla bilinen zararlılar | Servise bağlı | **Aktif içerik** (gömülü JS, otomatik eylem, `Launch`, `EmbeddedFile`); bilinmeyen/sıfırıncı gün aktif içerik riskini azaltır | Sadece "PDF görünümlü mü" |
| Yakalamadığı | Yeni/imzasız zararlı; şifreli içerik | Benzersiz CV'de hash eşleşmesi yok; yeni dosya yüklemek şart | – | Obfuscation (`#`-kodlu isimler, `/ObjStm` içinde gizlenmiş anahtarlar) → yanlış negatif | Hemen her şey |
| Gizlilik / KVKK | Veri sunucuda kalır ✔ | **CV üçüncü tarafa gider**; yurt dışı aktarım (KVKK md. 9) → CV içeriği ve kişisel veri dışarı çıkar. Paylaşım politikası resmi sayfadan doğrulanamadı (**VARSAYIM:** yüklenen dosyalar güvenlik topluluğu/müşterilerce erişilebilir olabilir) | Servise bağlı, yurt dışı muhtemel (**VARSAYIM**) | Veri sunucuda kalır ✔ | Veri sunucuda kalır ✔ |
| Maliyet / kota | Ücretsiz (açık kaynak); kaynak maliyeti RAM | Ücretsiz genel API: **4 istek/dk, 500 istek/gün** ve **ticari ürün/hizmette kullanım yasak** (resmi dokümantasyon). Topluluk sitesinin "ticari" sayılıp sayılmayacağı belirsiz → risk | Genelde ücretli/kotalı (**VARSAYIM**) | Ücretsiz | Ücretsiz |
| Kaynak ihtiyacı | **Min. 3 GiB, tercihen 4 GiB RAM**; imza yüklemesi ~1,2 GiB, DB yenilemede ~2,4 GiB'a çıkar; ClamAV Docker dokümanı | İstek başı ağ gecikmesi (saniyeler–dakikalar; dosya yükleme + sorgulama asenkron) | Ağ gecikmesi | ~ms; CPU/RAM ihmal edilebilir | Yok |
| Coolify uygunluğu | Ayrı container (Docker Image kaynağı veya Compose) ve **internal ağ**; port **yayınlanmamalı** (Coolify dokümanı: `ports:` yayını proxy'yi atlar/iç servisi açar; ClamAV dokümanı: TCP'de şifreleme/koruma yok). CMS ile aynı Docker ağında olması/olmaması **doğrulanmalı** (**VARSAYIM:** aynı proje/ortamdaki kaynaklar ağ paylaşır; Coolify'da "destination" ayarına bağlı). İmzalar için persistent volume önerilir (`_base` imaj + volume) | Container gerekmez; API anahtarı (gizli env) gerekir | Container gerekmez; anahtar | Container yok; uygulama içi kod | – |
| Karmaşıklık | Orta: yeni Coolify kaynağı + env + `clamd` INSTREAM istemcisi (paket yerine Node `net` ile ~40 satır yazılabilir → yeni bağımlılık gerekmez) + arıza modu kararı (fail-open/closed) | Düşük–orta (asenkron akış, kota yönetimi) | Orta | Düşük–orta (kural yazımı, yanlış pozitif ayarı: normal CV'lerde `/URI` çok yaygın, tek başına engel olmamalı) | Yok |
| Arıza davranışı | clamd düşerse: ya başvuru kabul (fail-open, `scanStatus: skipped`) ya reddetme (fail-closed). **Karar gerekir** | Kota/ağ hatasında aynı ikilem | Aynı | Yok | – |
| ROADMAP uyumu | ✔ ("ClamAV container'ı") | ✔ ("VirusTotal / FileScan API") | ✔ | Ek (ROADMAP'te yok) | ✘ (madde 4'ü karşılamaz) |
| Tahmini ek yük (aylık) | Sunucuya +3–4 GiB RAM ayırma (**VARSAYIM:** mevcut sunucu kapasitesi bilinmiyor) | 0 TL ama kota/yasal risk | **VARSAYIM:** ücretli | 0 | 0 |

**Gözlem (öneri değil, değerlendirme):**
- **Gizlilik kriterine göre B ve C zayıf** (CV, adayın kimlik/iletişim/eğitim verisini taşır).
- **D tek başına yetersiz ama ucuz**; A'nın tamamlayıcısı olabilir (A bilinen zararlıları, D aktif içeriği hedefler). A'yı koşamıyorsak D + E birleşimi "en az" seviye olur; bu, ROADMAP madde 4'ü **kısmen** karşılar (karar ürün sahibinin).
- A için RAM yeterliliği doğrulanmadan kurulum planlanmamalı.

### 5.3 Saklama modeli ("otomatik silinmeyecek, ekip manuel silene kadar kalacak")

Tasarım sonuçları:

1. **Otomatik silme job'ı yazılmaz** (karar uyarınca). Yeni altyapı (cron/queue) gerekmez.
2. Silme işlemi **kalıcı** olmalı: kayıt + dosya birlikte (Seçenek A bunu tek adımda sağlar). Arşivleme (`status: archived`) silme değildir; `archived` kayıtlar da dosya tutar → arşivi "silinmiş sanma" riski. Admin arayüzünde net etiket gerekir.
3. **Manuel süreç görünür olsun:** `consentAt` + admin liste sütunu/filtre ("90+ gündür bekleyen"); ekibe düzenli gözden geçirme hatırlatması prosedürle (kod değil) sağlanır.
4. **Aday talebiyle silme yolu** (KVKK md. 11) için iletişim e-postası ve 30 gün SLA'sı prosedürde yazılmalı (`KvkkSettings.documentMeta.contactEmail` mevcut). Silme talebinde ilgili kaydı kimin, nasıl bulacağı tanımlanmalı (e-posta ile arama için admin listesinde `email` araması).
5. **Yedekler:** `deploy/backup-db.sh` yalnızca PostgreSQL'i yedekler, 7 gün tutar. Silinen aday kaydı **en fazla 7 gün** eski dump'larda kalabilir (bu betik hâlâ kullanılıyorsa; **VARSAYIM:** Coolify'da başka yedek mekanizması olabilir). CV dosyaları (diskte) **yedeklenmiyor** → disk kaybında CV'ler gider. İkisi de bilinçli karar gerektirir (§8).

### 5.4 İndirme ve erişim güvenliği

- `GET /api/job-applications/file/<ad>` yalnızca oturumlu kullanıcıya açık (koleksiyon `read`).
- `modifyResponseHeaders` ile `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store` önerilir (tarayıcı içinde açma/önbellek riskini azaltır).
- `upload.handlers` ile her indirme için **erişim logu** (kim, hangi kayıt, ne zaman) tutulabilir (`getFile.js` handler'ı dosya akıtılmadan çağırıyor). Listeleme okumaları için `afterRead` yerine yalnızca **dosya indirme** loglamak gürültüyü azaltır.
- Admin panelinde Payload dosya önizlemesi/indirme oturumlu kullanıcıyla çalışır; `staticDir` dışarıdan servis edilmemeli (örn. Next `public/` altına **konmamalı**; mevcut `media` kök dizinde, `public` yok).
- Dosya yolu: `staticDir` için **mutlak ve volume'a bağlı** bir yol; `media` ile **aynı dizin altına konmamalı**.

### 5.5 Kalıcı depolama (Coolify)

- Coolify dokümanı: container dosya sistemi her redeploy'da değişir; yalnızca **mount edilmiş** yollardaki veri kalıcıdır.
- Mevcut `Media` yüklemeleri (`localhostusak-cms/media`) için canlıda volume tanımlı mı **bilmiyoruz** (**VARSAYIM:** tanımlıdır; aksi hâlde etkinlik görselleri her deploy'da kaybolurdu ama doğrulanmadı).
- CV dizini için **ayrı volume** gerekir. Bu bir **Coolify paneli adımıdır** (kullanıcı yapar): Application → Configuration → Persistent Storage → Add → hedef yol.
- Bulut depolama (S3) alternatifi mevcut politika gereği ("gereksiz altyapı kurma") şimdilik önerilmez; ölçek (aylık yüzlerce CV) disk için yeterli (**VARSAYIM:** gerçek başvuru hacmi ölçülmedi).

---

## 6. KVKK ile ilgili teknik gereksinimler

> Hukuki tavsiye değildir; teknik gereksinim listesidir. Metinlerin hukuki uygunluğu bir uzman/yetkili tarafından onaylanmalıdır.

| # | Gereksinim | Teknik karşılığı |
|---|---|---|
| 1 | **Aydınlatma yükümlülüğü** (md. 10): veri sorumlusu kimliği, işleme amacı, aktarım, toplama yöntemi/hukuki sebep, haklar | Form yanında **CV'ye özel aydınlatma** (kısa özet + `/kvkk` linki). Mevcut `/kvkk` içeriği "etkinlik muvafakatnamesi" odaklı; CV dosyası, saklama süresi, kimlerin göreceği **eksik**. `KvkkSettings`'e (veya `CareersPageSettings`'e) CV aydınlatma/rıza alanları eklenecek. |
| 2 | **Açık rıza**: belirli konuya ilişkin, bilgilendirmeye dayalı, özgür iradeyle (md. 3) | Ayrı, önceden işaretli **olmayan** onay kutusu; **etkinlik/fotoğraf muvafakatiyle birleştirilmemeli**. Sunucuda `consentGiven === true` zorunlu; `consentAt` ve `consentTextVersion` kaydedilir. |
| 3 | **Hukuki sebep ve yetenek havuzu**: belirli bir pozisyon dışında CV tutmak için çoğunlukla açık rıza gerekir (**VARSAYIM:** Kurul uygulaması; kesin sınıflandırma hukuki görüş ister) | Formda amaç açıkça "havuzda tutma + fırsat iletme". Kurul kararı 2021/670: iş başvurusu olumsuz bitince meşru menfaat/sözleşme gerekçelerinin yetmediği, silmenin **30 gün** içinde yapılması gerektiği yönünde değerlendirme. |
| 4 | **Saklama süresi beyanı** | Aydınlatmada süre/kriter yazılmalı. Mevcut karar "manuel silinene kadar" → süre belirsiz. Site metni (`KvkkPage.tsx` §8) "amaç ortadan kalkınca silinir" diyor. **Çelişki** (bkz. §8-1). Silme, yok etme yönetmeliği periyodik imha aralığını en fazla **6 ay** olarak sınırlar (saklama-imha politikası hazırlaması gereken veri sorumluları için). Bu topluluğun bu yükümlülük kapsamında olup olmadığı **VARSAYIM / bilinmiyor**. |
| 5 | **Veri güvenliği** (md. 12) | Private depolama, admin-only okuma, `attachment` başlığı, tarama, TLS (Traefik/Let's Encrypt), parola politikası. İdeal: disk şifreleme (**VARSAYIM:** sunucuda yok/bilinmiyor). |
| 6 | **Yurt dışı aktarım** (md. 9, 7499 sayılı kanunla 1 Haziran 2024'te değişti) | Tarama için VirusTotal/harici API kullanılırsa CV içeriği yurt dışına çıkar → uygun güvence/açık rıza ve aydınlatma gerekir. ClamAV ile bu risk oluşmaz. Hosting sağlayıcısının konumu (Keybuu/VDS) aydınlatmada zaten genel ifadeyle geçiyor; **yeniden gözden geçirilmeli**. |
| 7 | **Erişim logu** (kim, ne zaman, hangi CV'yi indirdi) | `upload.handlers` ile indirme olayı kaydı; ayrı küçük `access-logs` koleksiyonu (salt-ekleme, admin okur). Gereksiz çoğaltmamak için içerik yok, yalnızca `userId`, `applicationId`, `at`. IP isteğe bağlı/hash'li. |
| 8 | **Veri minimizasyonu** | Zorunlu alan: ad, e-posta, CV, rıza. `phone` isteğe bağlı olabilir. Ham IP saklama. Form metninde "özel nitelikli veri (sağlık, din, fotoğraf, TC no vb.) içermeyen CV yükleyin" uyarısı. |
| 9 | **İlgili kişi hakları** (md. 11) | Başvuru e-postası (`KvkkSettings.documentMeta.contactEmail`) mevcut; "kaydı bul ve sil" için admin aramasında `email` alanı aranabilir olmalı. 30 gün yanıt süresi `KvkkPage.tsx`'te yazılı. |
| 10 | **Silme tutarlılığı** | Kayıt silinince dosya da silinmeli (test edilecek); yedeklerdeki kalıntı süresi aydınlatmada/prosedürde dürüstçe belirtilmeli (§5.3-5). |
| 11 | **Üçüncü taraf aktarımı** | CV'ler yalnızca ekibe açık. Şirketlere iletim yapılacaksa (CareerCTA metni "yetenek arayan şirketler" diyor) **ayrı** açık rıza + aktarım kaydı gerekir. Bu rapor şirkete iletimi kapsam **dışı** varsayıyor (**VARSAYIM**). |
| 12 | **Çocuk/ergen** | Öğrenciler arasında 18 yaş altı olabilir (lise stajyeri). Yaş doğrulaması ROADMAP'te yok → Açık Soru. |

---

## 7. Riskler ve etkilenecek dosyalar

### 7.1 Etkilenecek / eklenecek dosyalar (yüksek seviye; **henüz değiştirilmedi**)

| Dosya | Değişiklik | Risk |
|---|---|---|
| `localhostusak-cms/src/collections/JobApplications.ts` | **YENİ** | Düşük (izole) |
| `localhostusak-cms/src/payload.config.ts` | Koleksiyonu `collections` dizisine ekle (isteğe bağlı: `upload` limitleri) | Orta: `upload.limits` değişirse `Media`'yı etkiler |
| `localhostusak-cms/src/migrations/*` + `index.ts` | **YENİ migration** (yeni tablolar/enum'lar) | **Yüksek:** `main` merge'inde production açılışında otomatik çalışır |
| `localhostusak-cms/src/payload-types.ts` | `generate:types` ile yeniden üretim | Düşük (üretilmiş dosya, büyük diff) |
| `localhostusak-cms/src/globals/KvkkSettings.ts` **veya** `CareersPageSettings.ts` | CV aydınlatma/rıza metni, form başlık/başarı mesajı alanları (**mevcut global'e alan eklemek**) | Orta: yeni sütunlar migration'a girer; seed global'leri ezer |
| `localhostusak-cms/src/collections/Users.ts` | **Yalnızca rol seçeneği 2 seçilirse** | **Yüksek:** `users` tablosu + tüm access'ler |
| Ortak yardımcı (örn. `src/lib/rateLimit.ts` — **yeni**) | `Projects.ts`'teki `Map` kalıbının ortaklaştırılması; FAZ 7 de kullanır | Orta: `Projects.ts` refaktörü canlı "like" davranışını etkileyebilir; ilk adımda **dokunmadan** yeni util yazılabilir |
| `localhostusak-cms/src/seed.ts` | Yeni global alanları eklenecekse | Orta (canlıda çalıştırılmaz) |
| `localhostusak-cms/.env.example`, `.env.production.example`, `.env.development.example` | Yeni değişken isimleri | Düşük |
| `ENVIRONMENTS.md` / `ROADMAP.md` | CV depolama volume, ClamAV servisi dokümante | Düşük |
| `localhostusak-web/src/pages/CareersPage.tsx` | Form bölümü ekle | Düşük |
| `localhostusak-web/src/components/careers/` | **YENİ** `ApplicationForm`, `FileDropzone` (+ gerekirse `CareerCTA` entegrasyonu) | Düşük |
| `localhostusak-web/src/services/api.ts` | `submitJobApplication()` (FormData) | Düşük |
| `localhostusak-web/src/types/` | **YENİ** başvuru tipi | Düşük |
| `localhostusak-web/src/styles/subpages.css` veya yeni CSS | Form/dropzone/onay stilleri; Pixel/Modern tema | Düşük |
| `localhostusak-web/src/pages/KvkkPage.tsx` | CV işleme bölümü/saklama süresi metni | Düşük–orta (metin kararı gerekir) |
| `localhostusak-web/src/seo/pages.json` | Yeni route eklenirse | Düşük |
| Coolify (panel) | Volume (CV dizini), ClamAV kaynağı, env | **Panel adımı — kullanıcı yapar** |

Dokunulmaması gerekenler: `Careers.ts` (ilanlar), mevcut `Media.ts` erişim kuralı, `TeamMembers.ts`, `Events.ts`, `Projects.ts` alanları.

### 7.2 Risk listesi

| # | Risk | Etki | Azaltma |
|---|---|---|---|
| R1 | CV'nin yanlışlıkla `Media`'ya konması / `read` açık bırakılması | **CV'ler herkese açık** | Ayrı koleksiyon, `read: Boolean(user)`, entegrasyon testi: anonim `GET` dosya → 403 |
| R2 | `create: () => true` | Alan enjeksiyonu (`status`, `notes`), kontrol atlama | Özel endpoint + koleksiyon `create` admin-only |
| R3 | Migration production'a otomatik uygulanır | Hatalı migration canlı DB'yi etkiler | Yerel/ayrı test DB'de `migrate` + `migrate:down` dene; yalnızca **ekleme** (add-only) migration; `main` merge öncesi PR incelemesi (branch protection yok, `ENVIRONMENTS.md`) |
| R4 | Şema kayması geçmişi (`reconcile_schema_drift`) | Üretilen migration beklenenden fazlasını içerir | Migration üretmeden önce `migrate:status`; üretilen SQL'i satır satır oku |
| R5 | Rol yokluğu | Tüm CMS kullanıcıları tüm CV'leri görür | §4.4; en azından admin kullanıcı sayısını öğren |
| R6 | Disk kalıcılığı belirsiz | CV'ler her deploy'da silinir veya yedeksiz kalır | Önce volume (panel adımı) ve yedek kararı; CV'ler **canlıya açılmadan** doğrulanmalı |
| R7 | Bellek içi rate limit | Redeploy/çoklu süreçte sıfırlanır; `x-forwarded-for` sahte olabilir (Traefik'in başlığı nasıl ele aldığı doğrulanmadı — **VARSAYIM**) | Honeypot + zaman-tuzağı + sunucu tarafı toplam günlük üst sınır; ihtiyaç doğarsa DB tabanlı sayaç (ölçüm sonrası) |
| R8 | Büyük/çok sayıda yükleme → bellek | CMS (Next+Payload) süreci RAM'i dolar | 5 MB sınırı erken uygula, `requestSizeLimit` düşür, rate limit |
| R9 | ClamAV RAM ihtiyacı (3–4 GiB) | Aynı sunucudaki CMS/Postgres'i sıkıştırır | Kurulumdan önce sunucu kaynak ölçümü (**VARSAYIM:** 12 GB eski dokümandan); alternatif D+E |
| R10 | ClamAV internal ağda değil / port yayını | clamd (şifresiz, kimlik doğrulamasız) internete açılabilir | `ports:` kullanma; yalnızca internal ağ; panelden doğrula |
| R11 | `validatePDF` yanlış reddi | Gerçek CV'ler "geçersiz PDF" olur | Word/Docs/Canva/LaTeX/Preview çıktılarıyla test seti; kullanıcıya anlaşılır hata mesajı |
| R12 | PDF aktif içerik kuralı yanlış pozitif | Normal CV'lerde `/URI`, `/AcroForm` yaygın | Engel listesi dar tut (`/JS`, `/JavaScript`, `/Launch`, `/OpenAction`+JS…); `/URI` engellenmez |
| R13 | Dosya adı sızıntısı | Aday adı URL/disk adında | UUID/timestamp yeniden adlandırma (hook) |
| R14 | Seed'in global'leri ezmesi | Yeni eklenen KVKK/Careers ayarları canlıda sıfırlanır | Seed canlıda **asla** çalıştırılmaz (proje hafızası); yeni alanlar için seed'e dokunulacaksa dikkat |
| R15 | CORS / çok parçalı POST | Tarayıcıdan `cms.*` alan adına `multipart` isteği preflight ister | `payload.config.ts` `cors` listesi mevcut; hem `.tech` hem `.com` var. Gerçek prod API alan adı (§3.1 tutarsızlık) doğrulanmalı |
| R16 | Yerelde production build env eksikliği | `npm run build` yerel env eksik diye düşer (proje hafızası) | Ayrı test DB ile production build denemesi **uygulama öncesi** planlanmalı |
| R17 | KVKK metni–uygulama uyumsuzluğu | Hukuki risk | §6, §8 |
| R18 | Ölü kod (`CareerCTA`, `auth.ts`) kullanılmıyor | Yanlış varsayımlarla yeniden bağlanabilir | Kullanılmadığı bilinmeli; eklenecekse bilinçli |

### 7.3 Mevcut yapıyı minimum değiştirerek ilerlemenin yolu

1. **Yalnızca ekleme (additive):** yeni koleksiyon + yeni bileşenler; mevcut koleksiyonlara/`Users`'a alan **ekleme**.
2. Global ayarları değiştirmek yerine form metinlerini **ilk sürümde** kodda sabit tutup (KVKK sayfasıyla uyumlu) CMS'e taşımayı sonraya bırakmak migration'ı küçültür; ancak metin değişiklikleri deploy gerektirir. (Takas: operasyonel esneklik ↔ migration riski.)
3. Rate limit util'i `Projects.ts`'e dokunmadan **yeni dosya** olarak yaz; ortaklaştırma sonra.
4. Tarama modülünü **arayüz arkasına** al (`scanFile(buffer) → { clean, engine }`); ClamAV bağlanana kadar D+E, sonra ClamAV eklenebilir. Mevcut altyapıya dokunmaz.
5. Özellik bayrağı: `CAREERS_APPLICATIONS_ENABLED` benzeri env ile endpoint'i kapalı deploy edip volume/ClamAV hazır olunca açmak, "migration canlıda, form kapalı" ara durumunu güvenli yapar (**ÖNERİ**).

---

## 8. Açık sorular — kullanıcı ve proje admini

**Karar bekleyenler (öncelik sırasıyla):**

1. **Saklama çelişkisi (kritik):** "CV'ler manuel silinene kadar kalır" kararı ile sitenin `/kvkk` §8 metni ("amaç ortadan kalkınca silinir") çelişiyor; Kurul kararı 2021/670 olumsuz sonuçlanan başvuruda 30 gün içinde silme yönünde. Seçenekler: (a) aydınlatmada açık bir üst süre ilan edip ekibin buna uyacağı prosedür (örn. "en geç X ay"), (b) kararı koruyup metni "talep üzerine veya ekip değerlendirmesiyle silinir" olarak netleştirmek, (c) otomatik silme (karar dışı). Hangisi? Hukuki danışman var mı?
2. **Tarama yöntemi:** ClamAV mı (RAM 3–4 GiB gerekir), D+E (aktif içerik kontrolü) mu, yoksa kademeli (önce D+E, sonra ClamAV) mü? Tarama servisi çökerse başvuru **kabul mü** (fail-open) **red mi** (fail-closed)?
3. **Sunucu kapasitesi:** Coolify sunucusunun gerçek RAM/CPU/disk değeri nedir? (Rapordaki 12 GB eski dokümandan.)
4. **CV dosyaları için kalıcı depolama:** Coolify'da şu an `media` için persistent volume var mı? CV için ayrı volume açılabilir mi? **(Coolify panel adımı — sen yaparsın; uygulama aşamasında tıklama tıklama anlatılacak.)**
5. **Yedekleme:** `backup-db.sh` canlıda hâlâ çalışıyor mu? CV dosyaları yedeklenecek mi? Yedekte kalan silinmiş kayıt süresi kabul edilebilir mi?
6. **Roller:** `Users`'ta kaç kayıt var, kim CV görmeli? Herkes görebiliyorsa sorun yok mu (§4.4 seçenek 1) yoksa admin/editör ayrımı mı?
7. **Tek koleksiyon (A) mu iki koleksiyon (B) mu?** (§4.1)
8. **Başvuru türü:** Genel "yetenek havuzu" mu, belirli ilana başvuru mu (`jobId`)? Mevcut `careers` ilanlarıyla ilişkilendirilecek mi?
9. **Dosya türü:** Yalnızca PDF mi kalacak (ROADMAP) yoksa DOCX de eklensin mi? (DOCX ek tarama/doğrulama yükü getirir.)
10. **Bildirim:** Yeni başvuruda ekibe e-posta/WhatsApp bildirimi isteniyor mu? (Şu an e-posta altyapısı yok; eklenirse yeni bağımlılık/servis gerekir → önce onay.)
11. **Üçüncü tarafa aktarım:** CV'ler şirketlere iletilecek mi? (Şu an hayır varsayıldı.)
12. **18 yaş altı** başvuru kabul edilecek mi?
13. **Veri sorumlusu:** Localhost Uşak tüzel kişi/dernek mi, gayriresmî topluluk mu? (VERBİS/saklama-imha politikası yükümlülüğü ve aydınlatmadaki veri sorumlusu kimliği buna bağlı.)
14. **Hukuki metin:** CV aydınlatma/açık rıza metnini kim yazacak/onaylayacak?
15. **Canlı API alan adı:** `cms.localhostusak.tech` mi `.com` mu? (§3.1)
16. **Erişim logu** kapsamı: yalnız indirme mi, listeleme de mi? Log ne kadar tutulacak?
17. **Rate limit değerleri** (IP başına günlük kaç başvuru?) ve **spam** için CAPTCHA istenir mi? (Üçüncü taraf CAPTCHA yurt dışı veri akışı yaratır; ROADMAP honeypot ile yetinmeyi öneriyor — FAZ 7 için de geçerli.)
18. **Başvuru formu yeri:** `/kariyer` sayfası içinde mi, ayrı route'ta (`/kariyer/basvuru`) mı?
19. **Canlıya açış stratejisi:** Migration + kapalı özellik bayrağı ile iki aşamalı deploy kabul mü?

---

## 9. Önerilen uygulama sırası (yüksek seviye; kod yok)

> Hiçbir adım onay olmadan başlatılmaz. Her adım ayrı onay + PR + test kapısı olabilir.

| Aşama | İş | Çıktı / kapı |
|---|---|---|
| 0 | §8'deki 1–6 numaralı kararlar + Coolify volume/sunucu kapasitesi doğrulaması (panel adımları) | Yazılı karar kaydı (`YAPILACAKLAR.md`/bu doküman güncellemesi) |
| 1 | Yerelde ayrı test DB, `migrate:status` temizliği, production build denemesi için ortam hazırlığı | Çalışan yerel ortam; canlı DB'ye hiç bağlanılmaz |
| 2 | CMS: `job-applications` koleksiyonu + erişim kuralları + `mimeTypes`/`validatePDF` davranış testi (anonim erişim reddi, boş/sahte PDF reddi, 5 MB üstü reddi) | Entegrasyon testleri (vitest) |
| 3 | CMS: özel başvuru endpoint'i (honeypot, rate limit, rıza, alan doğrulama, UUID adlandırma, kayıt) — tarama arayüzü stub ile | Testler; bayrakla kapalı |
| 4 | CMS: indirme güvenlik başlıkları + erişim logu (`upload.handlers`) | Testler |
| 5 | Tarama: seçilen yönteme göre (D+E ve/veya ClamAV); ClamAV ise Coolify internal servis + env + arıza modu | Gerçek EICAR test dosyasıyla doğrulama (zararsız standart test dizgesi), clamd kapalıyken davranış testi |
| 6 | Migration üretimi + yerel test DB'de `up/down` ve inceleme | Migration PR'da ayrıca incelenir |
| 7 | Web: form bileşeni (drag&drop, doğrulama, onay kutusu, erişilebilirlik, Pixel/Modern tema), `api.ts` entegrasyonu, hata/başarı durumları | Tarayıcıda manuel test, farklı CV kaynaklarıyla |
| 8 | KVKK: CV aydınlatma/açık rıza metni (CMS veya sabit), `/kvkk` sayfası güncellemesi, saklama prosedürü dokümanı | Hukuki onay |
| 9 | Staging benzeri test (varsa) / canlıya ilk deploy: özellik **kapalı**, migration çalışsın; volume ve ClamAV doğrulansın; ardından özelliği aç | Raporlama: değişen dosyalar, env, izinler, test çıktıları, **yapılanlar/yapılmayanlar** |
| 10 | Operasyon: silme prosedürü, düzenli gözden geçirme, yedek kararı, FAZ 7 için ortak rate-limit/honeypot util'inin yeniden kullanımı | Prosedür dokümanı |

---

## 10. Dış kaynaklar

- ClamAV Docker dokümanı (RAM min. 3 GiB / tercih 4 GiB; ~1,2 GiB imza yüklemesi, DB yenilemede ~2,4 GiB; TCP 3310; "clamd over TCP … no protections … un-encrypted"; `_base` imaj + volume): https://docs.clamav.net/manual/Installing/Docker.html
- VirusTotal Public vs Premium API (4 istek/dk, 500/gün; ticari ürün/hizmette kullanım yasak): https://docs.virustotal.com/reference/public-vs-premium-api — *Gizlilik/paylaşım politikası sayfaları (`docs.virustotal.com/docs/privacy-policy`, `…/terms-of-service`) içerik döndürmedi; dosya paylaşımına dair ifade **doğrulanamadı → VARSAYIM**.*
- Payload upload dokümanı (`mimeTypes`, `staticDir`, `handlers`, `modifyResponseHeaders`, dosya erişiminin koleksiyon `read` kuralına bağlı olması, `upload.limits.fileSize` 20 MiB, `requestSizeLimit` 50 MiB): https://payloadcms.com/docs/upload/overview — ve yerel kaynak kod: `localhostusak-cms/node_modules/payload/dist/uploads/{checkFileAccess,checkFileRestrictions,endpoints/getFile}.js`, `utilities/validatePDF.js`, `uploads/fetchAPI-multipart/index.js`, `collections/operations/local/create.d.ts`.
- Coolify kalıcı depolama: https://coolify.io/docs/knowledge-base/persistent-storage
- Coolify Docker Compose (iç ağ, `ports:` yayını uyarısı): https://coolify.io/docs/knowledge-base/docker/compose
- KVKK Kurulu Karar Özeti 2021/670 (iş başvurusu olumsuz sonuçlandıktan sonra verinin işlenmeye devam etmesi): https://www.kvkk.gov.tr/Icerik/7136/2021-670
- Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik (periyodik imha ≤ 6 ay): https://www.kvkk.gov.tr/Icerik/5441/KISISEL-VERILERIN-SILINMESI-YOK-EDILMESI-VEYA-ANONIM-HALE-GETIRILMESI-HAKKINDA-YONETMELIK
- KVKK md. 9 değişikliği (7499 sayılı Kanun, 1 Haziran 2024) ve yurt dışı aktarım rehberi: https://www.kvkk.gov.tr/Icerik/8142/Kisisel-Verilerin-Yurt-Disina-Aktarilmasi-Rehberi
- PDF zararlı anahtar kelimeler (pdfid: `/JS`, `/JavaScript`, `/OpenAction`, `/AA`, `/Launch`, `/EmbeddedFile`, `/ObjStm`…): ikincil kaynaklar (arama özetleri); resmî dokümana ulaşılamadı → **kural listesi uygulama aşamasında Didier Stevens `pdfid` dokümantasyonundan doğrulanmalı.**

---

## 11. Yapılanlar / Yapılmayanlar

| Yapıldı | Yapılmadı (kısıt gereği) |
|---|---|
| ROADMAP, ENV, deploy, CMS ve web kaynak kodu okundu; Payload 3.90.1 upload kodu incelendi | Hiçbir kod/yapılandırma dosyası değiştirilmedi |
| Dış kaynaklar (ClamAV, VirusTotal kotası, Payload, Coolify, KVKK) kontrol edildi | Paket kurulmadı, migration çalıştırılmadı, git komutu çalıştırılmadı |
| Bu rapor yazıldı (`docs/KARIYER_ARASTIRMA.md`) | Canlı ortama (Coolify/CMS) bağlanılmadı; `.env` değerleri okunmadı/yazılmadı; yerel DB'ye de sorgu atılmadı |
| – | Alt ajan başlatılmadı |
| – | Doğrulanamayanlar: canlı volume durumu, sunucu RAM'i, Users sayısı, VirusTotal paylaşım politikası, Traefik `x-forwarded-for` davranışı, `req.file.name` hook ile değiştirilebilirliği, `graphQL: false` seçeneği |
