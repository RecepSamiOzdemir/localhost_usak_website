# Kariyer / CV Havuzu (FAZ 6) — Uygulama Planı

- **Durum:** PLAN — onay bekliyor. Bu belgedeki hiçbir adım uygulanmadı.
- **Tarih:** 5 Ekim 2026
- **Dayanak:** `docs/KARIYER_ARASTIRMA.md` (araştırma) + kullanıcının 6 kararı.
- **Etiketler:** **[KARAR]** kullanıcı verdi · **[ÖNERİ]** benim önerim, onay bekliyor · **[VARSAYIM]** doğrulanmadı, uygulamada/panelde doğrulanacak.
- **Kısıtlar (alt ajanlar dahil):** Canlı ortama (Coolify, canlı DB, canlı CMS) bağlanılmaz. Canlıdan gelen herhangi bir şey yalnızca kullanıcının elle ürettiği, kişisel veri içermeyen şema dosyasıdır (§4). Paket kurulmaz. Onaysız migration/commit/push yapılmaz.

---

## ⚑ GÜNCELLEME (5 Ekim 2026) — bu bölüm aşağıdaki çelişen kısımların yerine geçer

Durum: geliştiricinin canlı ortama (Coolify/SSH/DB) erişimi yok; yalnızca `new_era_w_yusuf`'a push eder, merge ve canlı işlemleri proje admini yapar.

1. **Aşama 0 artık kod için ön koşul değil.** Volume, `CV_STORAGE_DIR`, DB yedeği, yedek stratejisi, kalıcılık testi → `docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md` ("Merge öncesi admin kontrol listesi"). PR açıklaması bu dosyaya referans verir. Aşama 0 ve §4 (canlı şema dökümü) **iptal**.
2. **Migration testi tamamen lokal** (§4 yerine):
   1. Yerelde temiz DB `localhostusak_migtest` oluştur (geliştirme DB'sine dokunulmaz; hedef DB adı doğrulama koruması).
   2. Repodaki **mevcut 6 migration** uygulanır (`payload migrate`).
   3. Global ayar tablolarına (`careers_page_settings`, `kvkk_settings`, `site_settings`…) **sahte satır** eklenir (dolu tabloya `ADD COLUMN` denemesi).
   4. Yeni migration: `migrate` → şema denetimi → `migrate:down` → şema eski haline döndü mü → tekrar `migrate`.
   5. SQL incelemesi: `DROP`/`DELETE`/`UPDATE` yok.
   6. `NODE_ENV=production` ile `npm run build` (+ `start` ile açılış, `prodMigrations` yolu), ayrı `.env.production.local` (sahte `PAYLOAD_SECRET`, `DATABASE_URL` = migtest). Sonra DB ve geçici env silinir.
   Sınır: gerçek canlı şemayla birebir kıyas yapılmaz; canlıda bilinmeyen kayma riski admin yedeği + additive migration ile karşılanır (PR'a not).
3. **Güvenli varsayılanlar (kodda zorunlu; 5 Ekim 2026 düzeltmesi):**
   - **Geliştirme** (`NODE_ENV !== 'production'`): `CV_STORAGE_DIR` tanımsızsa yerel varsayılan `cv-applications/` kullanılır (`.gitignore` kapsamına alınır).
   - **Production**: yerel varsayılana **asla** düşülmez. `CV_STORAGE_DIR` tanımsız veya mutlak yol değilse uygulama **çökmez**, koleksiyon yüklenir; ancak hiçbir CV dosyası yazılmaz: admin panelinden yükleme ve başvuru endpoint'i **fail-closed** reddedilir, log'a net satır düşer: `[cv] CV_STORAGE_DIR tanımlı değil/geçersiz — dosya yazımı reddedildi`.
   - Bayrak **kapalıyken** davranış aynı: endpoint 503, yazma yok, çökme yok; web formu göstermez.
   - Bayrak **açık** ama dizin yok/yazılamıyorsa: istek başında dizin kontrolü; başarısızsa 503 + log `[cv] storage dizini yazılamıyor: <yol> (<hata>) — başvuru reddedildi`.
   - Admin kontrol listesinde kural: **"Volume ve `CV_STORAGE_DIR` tanımlanmadan bayrak açılmaz."**
4. **Saklama — admin onayıyla alınan karar (5 Ekim 2026):** aydınlatma metnindeki üst süre **2 yıl** (kesin). Otomatik silme yok, silme daima elle; admin paneli süre dolunca yalnızca uyarı verir. `retentionYears` CMS'te 2 varsayılanla durur.
5. **Roller — admin onayıyla alınan karar (5 Ekim 2026):** rol eklenmeyecek; tüm CMS kullanıcılarının CV görmesi admin tarafından onaylandı.

**PR açıklamasına girecek notlar:** (a) merge öncesi admin kontrol listesi dosyası; (b) **karar:** tüm CMS kullanıcıları CV görebilir (admin onaylı); (c) **karar:** saklama 2 yıl, silme elle (admin onaylı); (d) loglar redeploy'da kaybolabilir; (e) burst sayacı bellekte; (f) ClamAV ertelendi, fail-closed; (g) e-posta doğrulaması yok; (h) migration yalnızca lokalde test edildi; (i) production'da `CV_STORAGE_DIR` yoksa dosya yazımı reddedilir; (j) `ipHash` = HMAC-SHA256(IP, `CV_IP_HASH_SECRET`), production'da anahtar yoksa ve bayrak açıksa başvuru fail-closed reddedilir; (k) "lint config bu PR'dan önce de bozuktu, dokunulmadı"; (l) `npm run dev` ana geliştirme DB'sinde çalıştırılmaz, gerekirse geçici DB kullanılıp silinir. (m) Yanlış pozitif ölçümü: 01–11 uyumlu (5 Ekim 2026); hibrit (gömülü dosya) ve parola/izin korumalı PDF'ler kararla reddedilir, yönlendirme mesajı gösterilir; Word/Google Docs/Canva (12–17) bayrak öncesi ölçülecek. (n) **Proxy sorusu kapandı (5 Ekim 2026):** Cloudflare yok, CMS önünde yalnızca Coolify/Traefik var; `x-forwarded-for` son değer okuması doğrulandı. Sunucu Türkiye'de (Keyubu VDS). **Açık konu: (1) yedek stratejisi (§6.1).**

**Aşama sırası (güncel):** 1 koleksiyon → 2 tarayıcı/yardımcılar → 3 endpoint (+ dizin güvenliği) → 4 saklama/admin uyarısı → 5 indirme sertleştirme/log → 6 migration + lokal test → 7 web formu → 8 KVKK/doküman/PR notu. Her aşama sonunda onay kapısı.

---

## 0. Zaten yapıldı

| İş | Sonuç |
|---|---|
| Karar 6: tutarsız alan adı | `localhostusak-web/.env.production.example` içindeki `cms.localhostusak.com` → `cms.localhostusak.tech`. Kariyer işinden bağımsız, tek dosyalık ayrı commit: `97fa203` (`fix(web): point production API example to cms.localhostusak.tech`). Repoda başka `cms.localhostusak.com` geçişi yok (`git grep` ile doğrulandı). `payload.config.ts` CORS listesindeki `localhostusak.com` web origin'idir, CMS adresi değildir; dokunulmadı. |

---

## 1. Kararlar ve doldurulması gereken boşluklar

### 1.1 Kesinleşen kararlar

| # | Karar | Plandaki karşılığı |
|---|---|---|
| 1 | Otomatik silme yok; aydınlatmada üst süre; admin'de süresi dolanlar görünsün; silme elle | §3 Aşama 4 (süre kuralı + admin uyarısı) |
| 2 | ClamAV yok. Payload PDF doğrulaması + gömülü JS/aktif içerik kontrolü + 5 MB koleksiyon limiti + yeniden adlandırma. Hata → red (fail-closed). ClamAV sonradan takılabilir ayrı fonksiyon | §3 Aşama 2 |
| 3 | Coolify: volume durumu ve RAM bildirilecek; volume yoksa önce tanımlanacak, yedek önerisi hazırlanacak | §3 Aşama 0, §6 |
| 4 | Rol eklenmeyecek; `Users`'ta güvenilir adminler. PR açıklamasına not | §3 Aşama 8, §8 |
| 5 | Tek koleksiyon (`job-applications`, `upload: true`) | §2 |
| 6 | Canlı alan adı `.tech` | Yapıldı (§0) |

### 1.2 Mesajda boş kalan alanlar (köşeli parantezli) — **cevap gerekli**

| Alan | Bende ne var | Bu planda kullandığım geçici değer |
|---|---|---|
| `[X yıl]` saklama üst süresi | Değer verilmemiş | **[VARSAYIM] 2 yıl**; kodda sabit değil, CMS'te ayarlanır (§3 Aşama 4). Gerçek değeri sen belirle (aydınlatma metnini etkiler, hukuki onay gerekir). |
| `[volume var/yok, RAM X GB]` | Doldurulmamış | **[VARSAYIM] Volume YOK** (güvenli taraf: Aşama 0 volume tanımlamayı içerir). RAM yalnızca ileride ClamAV için önemli; bu planı etkilemez. Panelden gerçek durumu bildir. |
| `[N]` güvenilir admin | Doldurulmamış | PR notunda `N` boş bırakılır; sen yazarsın. Ben `Users` tablosunu sayamam (canlıya bağlanmam). |

### 1.4 Bellek içi sayaç değerlendirmesi (rate limit)

| Sayaç | Nerede | Redeploy'da | Kabul edilebilir mi? |
|---|---|---|---|
| IP başına günlük 15 | DB (kayıtlardan) | Sıfırlanmaz | Evet |
| E-posta başına günlük 1 | DB | Sıfırlanmaz | Evet |
| Dakikalık burst | Bellek | **Sıfırlanır**; çoklu süreçte paylaşılmaz | **Evet, bilinen sınırla.** Gerekçe: günlük üst sınır kalıcı; deploy'u saldırgan tetikleyemez ve deploy seyrek; burst sınırı yalnızca dakikalık aşırı yükü kesmek içindir. |
| **Boşluk:** reddedilen denemeler (geçersiz PDF, rıza yok) DB'de iz bırakmaz | – | – | Günlük DB sayacı yalnızca **başarılı** kayıtları sayar; reddedilen isteklerde tek koruma bellek içi burst + `Content-Length` ön kontrolü + honeypot. Tarama maliyeti ≤ 5 sn / 5 MB ile sınırlı. Kabul edilebilir **[ÖNERİ]**; Coolify'da tek container çalıştığı varsayılıyor **[VARSAYIM]** (çoklu replika olursa burst sınırı kopya başına işler). |
| **Ayrı risk:** e-posta doğrulaması yok | – | – | Biri başkasının e-postasıyla CV yükleyebilir (hem o kişinin günlük hakkını yer hem de üçüncü kişi adına rıza beyanı olur). E-posta altyapısı olmadığı için çözülmedi; aydınlatmada "başkası adına başvuru yapılamaz" beyanı + silme talebi yolu **[ÖNERİ]**. İleride e-posta doğrulaması ayrı iş. |

### 1.3 §8'deki diğer sorular için uyguladığım öneriler (hepsi **ÖNERİ/VARSAYIM**; itirazın varsa söyle)

| Soru | Uyguladığım varsayım |
|---|---|
| Başvuru türü | **[ÖNERİ]** Genel "yetenek havuzu". İlana özgü `jobId` yok (sonra eklenebilir, ilan koleksiyonuna dokunmadan). |
| Dosya türü | **[ÖNERİ]** Yalnızca PDF (ROADMAP). |
| Bildirim (e-posta/WhatsApp) | **[ÖNERİ]** Yok. E-posta altyapısı yok; yeni servis = onay gerektirir. Admin listesinde `status = new` filtresi/uyarısı yeterli. |
| Şirketlere CV iletimi | **[VARSAYIM]** Yok; metinde "yalnızca topluluk yönetim ekibi görür" yazılır. |
| 18 yaş altı | **[ÖNERİ]** Rıza metnine "18 yaşını doldurduğumu beyan ederim" ifadesi (hukuki onayla). |
| Veri sorumlusu kimliği | **[VARSAYIM]** Mevcut KVKK metnindeki "Localhost Uşak" ifadesi aynen kullanılır; tüzel kişilik bilgisi sende. |
| Hukuki metin | **[ÖNERİ]** Taslağı ben yazarım, CMS'te düzenlenebilir, onay sende/danışmanında. |
| Erişim logu | **[ÖNERİ]** v1: her CV indirmesi için yapılandırılmış log satırı (kim, hangi kayıt, ne zaman; CV içeriği/ad yok) → Coolify container logları. DB tablosu **yok** (şema büyümesin). Zayıf yan: Docker log rotasyonuyla silinir **[VARSAYIM]**. İstersen v2'de `cv-access-logs` koleksiyonu. |
| Rate limit | **[KARAR 5 Ekim 2026]** Günlük: veritabanı sorgusu — aynı `ipHash` için son 24 saatte **≤ 15** başvuru (CGNAT/kampüs ortak IP'si gözetilerek gevşetildi); aynı e-posta için 24 saatte **≤ 1**. Bu sayaçlar kayıtlardan hesaplandığı için redeploy'da **sıfırlanmaz**. Burst koruması: bellek içi (IP başına dakikada 3 deneme **[ÖNERİ, kampüs için gevşek]**) → redeploy'da sıfırlanır; değerlendirme §1.4. + honeypot + minimum doldurma süresi. CAPTCHA yok. |
| Erişim logu notu | **[KARAR]** v1 uygulama logu. PR notuna zorunlu satır: *"Erişim logları Coolify/Docker container loglarında tutulur; redeploy'da veya log rotasyonunda kaybolabilir. Kalıcı erişim kaydı gerekirse `cv-access-logs` koleksiyonu ayrı iş olarak eklenmeli."* |
| IP saklama | **[KARAR]** Ham IP saklanmaz; `HMAC-SHA256(ip, CV_IP_HASH_SECRET)` → `ipHash`. Production'da env yoksa + bayrak açıksa fail-closed red. Kayıtla birlikte silinir. |
| IP çıkarımı | **[DOĞRULANDI, 5 Ekim 2026: Cloudflare yok, yalnızca Coolify/Traefik]** Önde tek proxy (Traefik) var → `x-forwarded-for`'un **son** girdisi kullanılır (`Projects.ts` ilkini alıyor; sahte başlığa açık). Canlıda doğrulama: ilk deploy sonrası test isteğiyle. |
| Form yeri | **[ÖNERİ]** `/kariyer` sayfasında, ilan listesinin altında `#basvuru` bölümü (yeni route yok, `seo/pages.json` değişmez). |
| Canlıya açış | **[ÖNERİ]** Özellik bayrağı: `CareersPageSettings.applicationForm.enabled` (varsayılan **kapalı**), redeploy gerektirmeden admin'den açılır. |
| Rate limit/honeypot ortaklaştırma | **[ÖNERİ]** Yeni `src/lib/` dosyası; `Projects.ts`'e **dokunulmaz** (canlı "like" davranışı riski). FAZ 7 sonra aynı dosyayı kullanır. |

---

## 2. Mimari özeti

```
Tarayıcı (/kariyer#basvuru)
   │  multipart POST  (cms.localhostusak.tech/api/job-applications/apply)
   ▼
Payload endpoint  ──►  [1] bayrak açık mı? (global)
                       [2] honeypot + min. süre
                       [3] rate limit (burst bellek + günlük DB)
                       [4] alan doğrulama + rıza (consent) + 18 yaş beyanı
                       [5] boyut ≤ 5 MB (Content-Length ön kontrol + gerçek boyut)
                       [6] scanCv(buffer)   ← ayrı fonksiyon, fail-closed
                       [7] yeniden adlandır: cv_<uuid>_<epoch>.pdf
                       [8] payload.create(job-applications, file, overrideAccess)
                              └─ Payload: magic byte + validatePDF (mimeTypes: application/pdf)
   ▼
job-applications  (upload: true, staticDir = $CV_STORAGE_DIR, read/create/update/delete = yalnızca giriş yapmış kullanıcı)
   └─ dosya servisi: koleksiyon read kuralı geçerli → anonim 403
```

- **Tek koleksiyon [KARAR].** Başvuru kaydı ve CV aynı belge → atomik oluşturma/silme, tek erişim kuralı.
- **Koleksiyon `create` public değil.** Tek public giriş özel endpoint (araştırma §4.2).
- **Yeni paket yok.** `node:zlib` (PDF akış açma), `node:crypto` (UUID, HMAC), `Buffer` — hepsi Node yerleşik; mevcut `payload`/`next` yeterli.

### 2.1 Taramanın (Karar 2) ayrı fonksiyon tasarımı

```
src/lib/cv/scanner.ts        → export async function scanCv(input: Buffer): Promise<ScanResult>
src/lib/cv/scanners/types.ts → interface CvScanner { name: string; scan(buf: Buffer): Promise<{ ok: boolean; reasons: string[] }> }
src/lib/cv/scanners/pdfActiveContent.ts → ilk (ve şimdilik tek) tarayıcı
src/lib/cv/scanners/index.ts → const scanners: CvScanner[] = [pdfActiveContent]   // ileride [pdfActiveContent, clamav]
```

Kurallar:
1. `scanCv` tüm tarayıcıları sırayla çalıştırır; **herhangi biri `ok:false` dönerse, hata fırlatırsa, zaman aşımına uğrarsa → red** (fail-closed).
2. Zaman aşımı **[ÖNERİ]** 5 sn toplam; açılan akış boyutu üst sınırı 20 MB (zip-bomb koruması); aşılırsa red.
3. Dönen `ScanResult { ok, engines: string[], reasons: string[] }`; `reasons` yalnızca sunucu loguna gider, kullanıcıya genel mesaj ("Dosya güvenlik kontrolünden geçemedi") döner.
4. ClamAV eklemek = `scanners/clamav.ts` yazıp diziye eklemek (clamd INSTREAM, Node `net`); başka dosya değişmez. Env (`CLAMAV_HOST/PORT`) o zaman eklenir.

PDF aktif içerik kuralları (**[ÖNERİ]**, test külliyatıyla ayarlanır; kaynak: pdfid anahtar kelimeleri):

| Durum | Karar |
|---|---|
| `/JS`, `/JavaScript`, `/Launch`, `/RichMedia`, `/XFA`, `/EmbeddedFile`, `/ImportData`, `/SubmitForm` | **Red** |
| `/OpenAction` veya `/AA` + (JS/Launch/URI-dışı eylem) | **Red**; yalnızca sayfa görünümü ayarı (`/GoTo`) ise geçer |
| `/Encrypt` (şifreli PDF) | **Red** (içeriği denetlenemez) |
| `/ObjStm` ve `FlateDecode` akışları | `zlib.inflateSync` ile açılıp **içerikte** aynı anahtarlar aranır (gizlemeyi azaltır) |
| `#xx` ile kodlanmış isimler (`/J#53`) | Taramadan önce normalize edilir |
| `/URI`, `/AcroForm` (tek başına) | **Geçer** (CV'lerde LinkedIn/GitHub linki yaygın; yanlış pozitif olmasın) |
| Açma/ayrıştırma hatası | **Red** (fail-closed) |

Sınır: anahtar kelime taraması bilinmeyen/ileri düzey gizlemeyi kaçırabilir; bu, ClamAV'ın yerini tutmaz. Aydınlatma/PR notunda dürüstçe belirtilir.

---

## 3. Aşamalar

> Her aşamanın sonunda **onay kapısı** vardır; sen "tamam" demeden sonrakine geçilmez. Commit'ler küçük ve ayrıdır (§9).

### Aşama 0 — Altyapı hazırlığı (kod yok; **panel adımlarını sen yaparsın**)

| Adım | Kim | Detay |
|---|---|---|
| 0.1 Volume durumunu doğrula | Sen | Coolify → CMS uygulaması → Configuration → Persistent Storage. `media` için mount var mı bak, bana yaz. |
| 0.2 CV volume'u tanımla | Sen | Aynı ekranda **Add** → *Volume Mount* (kaynak yolu boş = named volume **veya** kaynak yolu verirsen bind mount) → **Destination Path** `/app/data/cv` **[VARSAYIM: container çalışma dizini `/app`; panelden gerçek yol doğrulanacak]**. Adımları o gün tıklama tıklama, ekran ekran yazacağım. |
| 0.3 Env | Sen | Coolify → Environment Variables: `CV_STORAGE_DIR=/app/data/cv` (gizli değil). Redeploy gerekir. |
| 0.4 Yedek stratejisi | Sen karar | **Yurt dışı S3 yok [KARAR].** Türkiye'de tutulabilecek seçenekler `docs/KARIYER_ARASTIRMA`-dışı bu belgenin §6'sında karşılaştırıldı; **karar bekliyor**. Canlıya açmadan önce yeter. |
| 0.5 Veritabanı yedeği | Sen | Migration'ı canlıya göndermeden **önce** Coolify'da Postgres için bir kez manuel yedek al (Postgres kaynağı → Backups). `deploy/backup-db.sh` eski PM2 döneminden kalma görünüyor; canlıda çalışıp çalışmadığını bildir. |
| 0.6 Canlı şema dosyası | Sen | §4'teki "kişisel veri içermeyen" şema dökümü. Ben canlıya bağlanmam. |

**Kapı:** 0.1–0.3 tamam + 0.6 dosyası bende. (0.4 canlıya açmadan önce yeter.)

### Aşama 1 — Koleksiyon iskeleti (CMS)

| Dosya | İş |
|---|---|
| `localhostusak-cms/src/collections/JobApplications.ts` **YENİ** | `slug: 'job-applications'`; `upload: { mimeTypes: ['application/pdf'], staticDir: process.env.CV_STORAGE_DIR \|\| 'cv-applications', modifyResponseHeaders (attachment, nosniff, no-store) }`; `access.read/create/update/delete = Boolean(user)`; `graphQL` kapatma **[VARSAYIM: `graphQL: false` bu sürümde geçerli; `collections/config/types.d.ts` satır 524/693'te `graphQL` seçeneği var, uygulamada doğrulanacak]**. |
| Alanlar | `candidateName`, `email`, `phone?`, `linkedinUrl?`, `githubUrl?`, `experienceLevel`, `fieldsOfInterest` (`hasMany` select), `status` (`new/reviewed/contacted/archived`, alan-erişimi yalnız admin), `notes` (yalnız admin), `consentGiven` (zorunlu true), `consentAt`, `consentTextVersion`, `scanEngines` (text), `ipHash`. ROADMAP alanları aynen; `consent*`, `scanEngines`, `ipHash` **ÖNERİ**. `cvFile` ayrı alan değil → koleksiyonun kendi dosyası (**Sapma:** ROADMAP `cvFile` adı yerine Payload'ın `filename/url` alanları; tek koleksiyon kararı gereği). |
| Admin | `useAsTitle: 'candidateName'`, `defaultColumns: ['candidateName','email','status','consentAt']`, `listSearchableFields: ['candidateName','email']` (silme talebinde e-postayla bulmak için). |
| `localhostusak-cms/src/payload.config.ts` | `collections` dizisine `JobApplications` ekle. **Başka hiçbir şey değişmez** (global `upload.limits` dahil — `Media`'yı etkilememek için). |

Test: bkz. §5 (koleksiyon erişim testleri). **Kapı:** testler yeşil.

### Aşama 2 — Tarama ve yardımcı kütüphane (CMS)

| Dosya (hepsi YENİ) | İş |
|---|---|
| `src/lib/cv/scanner.ts`, `scanners/types.ts`, `scanners/pdfActiveContent.ts`, `scanners/index.ts` | §2.1 |
| `src/lib/cv/filename.ts` | `cvFilename()` → `cv_<randomUUID kısa>_<epoch>.pdf` (ROADMAP örneğiyle uyumlu) |
| `src/lib/cv/limits.ts` | `MAX_CV_BYTES = 5 * 1024 * 1024` tek yerde |
| `src/lib/http/clientIp.ts` | IP çıkarımı + `ipHash` (HMAC) |
| `src/lib/http/rateLimit.ts` | Genel bellek içi burst sınırlayıcı (FAZ 7 de kullanır); temizleme mantığı `Projects.ts`'tekiyle aynı fikir |

Test: §5 (birim testleri, sentetik PDF'ler). **Kapı:** birim testleri yeşil; yanlış pozitif külliyatı (Word, Google Docs, Canva, LaTeX, macOS Preview çıktısı CV'ler) senden alınan **örnek, kişisel bilgisi silinmiş** PDF'lerle denenir **[ÖNERİ]**.

### Aşama 3 — Başvuru endpoint'i (CMS)

| Dosya | İş |
|---|---|
| `JobApplications.ts` içinde `endpoints: [{ path: '/apply', method: 'post', handler }]` (`Projects.ts`'teki `/:id/like` kalıbı) | Sıra: bayrak → honeypot/min. süre → rate limit → `addDataAndFileToRequest(req)` ile multipart ayrıştırma → alan+rıza doğrulama → boyut → `scanCv` → `cvFilename()` ile ad değiştirme → `req.payload.create({ collection, data, file, overrideAccess: true })`. |
| Yanıtlar | Başarı `201 { success: true }`; doğrulama `400` genel mesaj; rate limit `429`; bayrak kapalı `503`; tarama/kontrol hatası `400` ("Dosya güvenlik kontrolünden geçemedi"). Hiçbir yanıtta kayıt verisi/`notes` dönmez. |
| CORS | Mevcut `cors` listesi yeterli olmalı **[VARSAYIM]**; yerelde `5173 → 3000` ve prod alan adıyla preflight denenir. |

Notlar (doğrulandı): `payload.create({ file })` → `generateFileData` → `checkFileRestrictions` çalışır (magic byte + `validatePDF`); `addDataAndFileToRequest` Payload'da mevcut ve global `upload` ayarlarını kullanır → 5 MB üstü istek varsayılan 20 MiB'a kadar belleğe girebilir; bu yüzden `Content-Length` > ~5,5 MB ise gövde okunmadan erken red **[ÖNERİ]**.

**Kapı:** endpoint testleri yeşil (§5).

### Aşama 4 — Saklama süresi + admin uyarısı (Karar 1)

Tasarım: son kullanma tarihi **saklanmaz**; `consentAt`'tan hesaplanır (süre değişirse eski kayıtlar bozulmaz).

| Dosya | İş |
|---|---|
| `localhostusak-cms/src/globals/CareersPageSettings.ts` | Yeni `applicationForm` grubu: `enabled` (checkbox, varsayılan `false`), `title`, `intro`, `consentText`, `consentVersion`, `successMessage`, **`retentionYears` (number, varsayılan 2 [VARSAYIM])**. Mevcut grupların hiçbiri değişmez. |
| `localhostusak-cms/src/components/admin/RetentionBanner.tsx` **YENİ** (sunucu bileşeni) | `payload.count` ile: (a) `consentAt` < şimdi − `retentionYears` olan kayıt sayısı → "N CV saklama süresini doldurdu" + filtre bağlantısı (`?where[consentAt][less_than]=…`); (b) `status = new` sayısı. Varsa 0 ise gizli. |
| `JobApplications.ts` | `admin.components.beforeListTable: [RetentionBanner]` |
| `src/app/(payload)/admin/importMap.js` | `npm run generate:importmap` ile **otomatik** güncellenir (üretilmiş dosya) |

Silme **elle**; hiçbir cron/otomasyon yazılmaz [KARAR]. Admin'de kayıt silinince dosyanın da silindiği testle doğrulanır (§5).
Risk: özel admin bileşeni hatalıysa yalnızca bu koleksiyonun liste ekranı bozulur; panelin geri kalanı etkilenmez **[VARSAYIM]** — testle doğrulanacak.

### Aşama 5 — Dosya indirme sertleştirme + erişim logu (CMS)

| Dosya | İş |
|---|---|
| `JobApplications.ts` → `upload.modifyResponseHeaders` | `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store` |
| `JobApplications.ts` → `upload.handlers` | Her indirmede log satırı: `{ event: 'cv_download', userId, applicationId?, at }` (CV içeriği/ad yok). Handler Response döndürmez (akış devam eder). |

### Aşama 6 — Migration (§4'teki prodcopy planıyla)

| Adım | İş |
|---|---|
| 6.1 | `migrate:create` → `src/migrations/<tarih>_add_job_applications_and_application_form.{ts,json}`; `src/migrations/index.ts` güncellenir (Payload üretir). |
| 6.2 | SQL elle okunur: yalnızca `CREATE TYPE/TABLE/INDEX` + `ALTER TABLE careers_page_settings ADD COLUMN …`; **`DROP`/`DELETE`/`UPDATE` yok** (grep ile denetlenir). |
| 6.3 | `payload-types.ts` yeniden üretilir (`generate:types`). |
| 6.4 | §4 test prosedürü. |

### Aşama 7 — Web formu

| Dosya | İş |
|---|---|
| `localhostusak-web/src/types/application.ts` **YENİ** | Form/ayar tipleri |
| `localhostusak-web/src/services/api.ts` | `submitJobApplication(formData)` (FormData; `Content-Type` başlığı elle konmaz) ve `CareersPageSettingsData`'ya `applicationForm` alanı |
| `localhostusak-web/src/components/careers/ApplicationForm.tsx` **YENİ** | Alanlar, istemci doğrulama (yalnızca UX), honeypot (gizli input), form-açıldı zaman damgası, rıza kutusu (işaretsiz başlar), durumlar (idle/gönderiliyor/başarı/hata/429) |
| `localhostusak-web/src/components/careers/FileDropzone.tsx` **YENİ** | Native Drag & Drop + tıklayıp seç, `accept="application/pdf"`, 5 MB istemci kontrolü, klavye/ekran okuyucu erişilebilirliği; yeni paket yok |
| `localhostusak-web/src/pages/CareersPage.tsx` | `settings?.applicationForm?.enabled` ise `#basvuru` bölümünü göster |
| `localhostusak-web/src/styles/subpages.css` (veya yeni `careers-form.css` + `App.tsx` importu) | `.form-group/.form-control` genişletme, dropzone, onay kutusu; token'lar + Pixel/Modern tema |
| `localhostusak-web/src/utils/…` | İhtiyaç olmadıkça yok |

Test: tarayıcıda manuel + tema (Pixel/Modern) + mobil. `FloatingCTA` ve `CareerCTA` (ölü bileşen) bu aşamada **değiştirilmez**.

### Aşama 8 — KVKK metinleri, dokümantasyon, PR notu

| Dosya | İş |
|---|---|
| `CareersPageSettings` metinleri (CMS) | CV'ye özel kısa aydınlatma + ayrı açık rıza + 18 yaş beyanı + "özel nitelikli veri içermesin" uyarısı + saklama süresi (`retentionYears` ile aynı kaynak) + "yalnızca yönetim ekibi" ifadesi |
| `localhostusak-web/src/pages/KvkkPage.tsx` | §2 (işlenen veriler) ve §8 (saklama) bölümlerine CV paragrafı; süre değeri `fetchCareersPageSettings()` üzerinden aynı kaynaktan okunur (metin tekrarı yok) |
| `.env.example`, `.env.production.example`, `.env.development.example` (CMS) | Yalnızca `CV_STORAGE_DIR` ismi/açıklaması, gerçek değer yok |
| `ENVIRONMENTS.md` | CV volume + `CV_STORAGE_DIR` + yedek notu |
| `ROADMAP.md` | FAZ 6'ya "tamamlanan/sapmalar" notu (tek koleksiyon, `cvFile` adı, ClamAV ertelendi) |
| `docs/KARAR_KARIYER_CV.md` **YENİ** | Kısa karar kaydı (neden bu tasarım; mutlak tarihlerle) |
| PR açıklaması | Karar 4 notu: *"Rol eklenmedi. `Users`'ta **N** güvenilir admin var; tüm giriş yapmış kullanıcılar CV'leri görebilir (bilinçli karar). Rol gerekirse ayrı iş."* + ClamAV ertelendi notu + yapılanlar/yapılmayanlar + prod önlemleri |

---

## 4. Migration'ı canlı şemaya karşı lokalde test etme

### 4.1 Önce bir çelişkiyi çözmek gerek

İstediğin: *"lokalde canlı DB kopyası üzerinde test"*. Kendi güvenlik kuralların: canlı connection string yerelde bulunmaz, yerel geliştirme production'a bakmaz, kişisel veri gereksiz yere dökülmez (KVKK). Tam dump `users` (e-posta, parola hash'i) ve `payload_preferences` gibi tabloları taşır. **Önerim [ÖNERİ]:** canlıya **bağlanmadan**, senin ürettiğin **yalnızca şema + `payload_migrations` satırları** dökümü. Bu kişisel veri içermez ve migration'ın canlı şemaya uyup uymadığını (asıl risk) kanıtlar. Tam veri dökümü istersen: anonimleştirilmiş olmalı; bunu ayrıca onaylaman gerekir.

### 4.2 Prosedür

| # | Adım | Kim | Not |
|---|---|---|---|
| 1 | Canlı Postgres'te: `pg_dump --schema-only --no-owner --no-privileges <db> > schema.sql` ve `pg_dump --data-only -t payload_migrations <db> > payload_migrations.sql` | **Sen** (Coolify → Postgres kaynağı → Terminal, ya da SSH). Ben bağlanmam. | Dosyaları bana bu depoda **commit etmeden** (örn. `/tmp` dışında, repo dışı bir klasörde) ver; içinde veri yok ama gereksiz yere repoya girmesin. |
| 2 | Canlı Postgres sürümünü bildir (`SELECT version();`) | Sen | Yerel sürüm: `postgresql@16`. Fark büyükse dump uyumsuz olabilir **[VARSAYIM: 16]**. |
| 3 | Yerelde **ayrı** DB: `createdb localhostusak_prodcopy` | Ben (onayınla) | Geliştirme DB'sine (`localhostusak`) dokunulmaz. |
| 4 | `psql -d localhostusak_prodcopy -f schema.sql` + `payload_migrations.sql` | Ben | |
| 5 | **Sentetik veri:** `careers_page_settings`, `kvkk_settings`, `site_settings` gibi global tablolara **uydurma** tek satır ekle | Ben | Şema-only dökümde global satırı yok; oysa canlıda dolu. `ALTER TABLE … ADD COLUMN` dolu tabloda denenmiş olur. |
| 6 | Doğrula: `payload_migrations` kayıtları = repodaki 6 migration mı? | Ben | Farklıysa **dur** ve raporla (canlıda bizim bilmediğimiz bir migration/kayma var demektir). |
| 7 | `DATABASE_URL` yalnızca bu komut için `localhostusak_prodcopy`'ye çevrilir (`ENVIRONMENTS.md`'deki `DOTENV_CONFIG_PATH` yöntemi, ayrı bir `.env.prodcopy.local` ile — `.gitignore` `.env*.local` kapsıyor). Komuttan önce hedef DB adı ekrana yazdırılır, `localhostusak_prodcopy` değilse çalıştırma durur. | Ben | |
| 8 | `payload migrate:status` → `payload migrate` (yeni migration uygulanır) | Ben | |
| 9 | Şema denetimi: `\d job_applications`, yeni sütunlar, enum'lar; mevcut tabloların değişmediği (diff) kontrolü | Ben | |
| 10 | `payload migrate:down` → şema eski haline döndü mü → tekrar `migrate` | Ben | Geri alma yolunu kanıtlar. |
| 11 | Üretim benzeri çalıştırma: `NODE_ENV=production`, ayrı `.env.production.local` (`PAYLOAD_SECRET` yerelde üretilmiş **sahte**, `DATABASE_URL` = prodcopy), `npm run build` + `npm start`; `prodMigrations` yolunun açılışta hatasız çalıştığı ve admin/API'nin açıldığı doğrulanır | Ben | Proje hafızası: yerel prod build `PAYLOAD_SECRET` olmadan düşer → ayrı test env şart. |
| 12 | Uçtan uca: test PDF'leriyle `apply` endpoint'i prodcopy üzerinde | Ben | §5 |
| 13 | Temizlik: `dropdb localhostusak_prodcopy`, geçici env dosyaları silinir | Ben | |

### 4.3 Canlıya geçişte

1. Canlı DB yedeği alınmış olmalı (Aşama 0.5).
2. Migration **additive**; özellik bayrağı **kapalı**.
3. `main`'e merge Coolify'ı tetikler → container açılışında migration çalışır. Başarısızlıkta container düşer, eski sürüm çalışmaya devam eder mi? **[VARSAYIM]** Coolify sağlık kontrolü yoksa kesinti olabilir → merge'i sakin bir saatte yap.
4. Merge sonrası: Postgres'te `payload_migrations` ve `\d job_applications` kontrolü; admin → yeni koleksiyon görünüyor mu; anonim `GET /api/job-applications` → 403.

---

## 5. Test planı

> Entegrasyon testleri `getPayload` ile `.env`'deki `DATABASE_URL`'e bağlanır (`tests/int/api.int.spec.ts`, `vitest.config.mts`). **Test DB'si ayrı olmalı** (`localhostusak_test`); komut öncesi DB adı doğrulama koruması eklenir. Mevcut testlerde `careers` yok; yeni testler `tests/int/` altına.

| Katman | Dosya (YENİ) | Senaryolar |
|---|---|---|
| Birim — tarayıcı | `tests/int/cv-scanner.int.spec.ts` | Geçerli minimal PDF ✔; `/JS` ✘; `/JavaScript` ✘; `/Launch` ✘; `/EmbeddedFile` ✘; `/OpenAction`+JS ✘; yalnızca `/OpenAction /GoTo` ✔; `/URI` ✔; `#`-kodlu `/J#53` ✘; `/ObjStm` içinde gizli `/JS` ✘; `/Encrypt` ✘; bozuk/yarım PDF ✘; zlib-bomb ✘; tarayıcı hata fırlatırsa **red (fail-closed)**; zaman aşımı red |
| Birim — yardımcılar | `tests/int/cv-helpers.int.spec.ts` | Dosya adı biçimi `cv_*_<epoch>.pdf` ve özgün ad sızmaması; `ipHash` deterministik ve ham IP içermez; rate limit penceresi |
| Entegrasyon — erişim | `tests/int/job-applications-access.int.spec.ts` | Anonim `find/create/update/delete` ✘; anonim `GET …/file/<ad>` → 403; girişli `GET` → 200 + `Content-Disposition: attachment` + `nosniff`; GraphQL'de görünmez **[VARSAYIM]**; `Media` hâlâ public (regresyon) |
| Entegrasyon — endpoint | `tests/int/job-applications-apply.int.spec.ts` | Bayrak kapalı → 503; honeypot dolu → sessiz red; rıza yok → 400; 18 yaş beyanı yok → 400; 5 MB+1 bayt → 400; uzantısı `.pdf` içeriği `.exe`/script → 400; geçerli PDF → 201, diskte UUID'li ad, `notes/status` istemciden verilemez (verilse yok sayılır); aynı IP 16. başvuru (24 saatte) → 429; aynı e-posta ikinci başvuru → 429; tarama `ok:false` → 400 ve **kayıt oluşmaz, dosya diskte kalmaz** |
| Entegrasyon — silme | aynı dosya | Kayıt silinince dosya diskten silinir |
| Admin | manuel | `RetentionBanner` sayıları, filtre bağlantısı, `status=new` uyarısı; `generate:importmap` sonrası panel açılıyor |
| Migration | §4 | up / down / up, prodcopy üzerinde production modunda açılış |
| Web | manuel + (isteğe) Playwright | Dosya seçme/sürükleme, hatalı tür/boyut, kutu işaretlenmeden gönderilemez, başarı/hata/429 durumları, Pixel+Modern tema, mobil, klavye ile kullanım; `npm run build` (tsc) hatasız |
| Regresyon | mevcut | `/kariyer` ilan listesi, `careers-page-settings` okuması, etkinlik/proje sayfaları değişmeden çalışıyor; `npm run check:seo` |

Gerçek zararlı dosya kullanılmaz; yalnızca elle üretilmiş **zararsız sentetik** PDF'ler (içinde sadece `/JS` anahtar kelimesi bulunan) kullanılır.

---

## 6. Yedek ve kalıcı depolama (Karar 3 — volume yok varsayımı)

1. Önce volume (Aşama 0.2). Volume olmadan CV özelliği **açılmaz** (bayrak kapalı kalır).
2. Yedek: yurt dışı S3 kullanılmaz [KARAR]. Seçenekler §6.1 tablosunda; karar bekliyor.
3. Yedeklerde silinmiş CV'ler yedek saklama süresi kadar (14 gün) kalır → aydınlatmada "yedeklerde en fazla 14 gün" ifadesi **[ÖNERİ]**.
4. DB yedeği: Coolify Postgres zamanlanmış yedeği önerilir; eski `backup-db.sh` canlıda kullanılıyorsa bildir.
5. `media` dizini ayrı konu (bu planın kapsamı dışı), ama aynı volume sorunu geçerli olabilir — 0.1'de bakılırken not edilir.

---

### 6.1 Türkiye içinde yedek seçenekleri (karar verilmedi — karşılaştırma)

Ortak bilgi: Coolify'ın uygulama volume yedeği `tar.gz` arşivi üretir, S3-uyumlu depoya gönderebilir; **panelden geri yükleme (restore) yoktur**, arşivler indirilebilir/silinebilir; arşiv sırasında yazma olursa tutarsızlık olabilir (kaynak: coolify.io/docs/core/persistent-storage/storage-mounts/backups). Arşivler Coolify tarafından **şifrelenmez**; şifreleme ayrı yapılmalıdır. CV'ler kişisel veri olduğu için uzak kopyalar şifreli olmalı.

| Seçenek | Konum | Felaket (sunucu kaybı) yedeği? | Artı | Eksi / karmaşıklık | Tahmini maliyet |
|---|---|---|---|---|---|
| A. Aynı sunucuda ayrı dizin/disk (Coolify yerel yedek, `Disable Local Backup` kapalı) | Aynı TR sunucu | **Hayır** (disk/sunucu giderse yedek de gider); yalnızca yanlışlıkla silmeye karşı | Sıfır ek servis; panelden kurulur; KVKK yurt dışı yok | Tek hata noktası | 0 TL (disk alanı) |
| B. İkinci bir TR sunucusuna şifreli kopya (sunucu üzerinde zamanlı görev: `restic`/`borg` + SFTP veya `rsync` over SSH) | 2. TR sunucu/VPS | **Evet** | Yurt içinde; istemci tarafı şifreleme (restic/borg) → depo sağlayıcısı içeriği göremez; Coolify'dan bağımsız | Sunucuya araç kurmak (proje bağımlılığı değil ama **sunucu paketi** → senin onayın); anahtar yönetimi (kaybedersen yedek açılmaz); ikinci sunucu kirası/bakımı; cron izleme | **[VARSAYIM]** küçük bir VPS/depolama kutusu aylık ücret; fiyat doğrulanmadı |
| C. Coolify storage yedeği → **TR içinde barındırılan S3-uyumlu depo** | TR'de MinIO/Ceph (kendi 2. sunucun) veya TR veri merkezli sağlayıcı | **Evet** | Coolify arayüzünden zamanlama + saklama; restore elle (arşiv indirilir) | S3 hedefi için kendi MinIO'nu kurmak = ek altyapı ("gereksiz altyapı" kuralı); arşiv **şifresiz** (sunucu tarafı/ bucket şifrelemesi ayarlanmalı); sağlayıcı seçimi gerekli. Örnek: Teletek'in Cloudian tabanlı hizmeti (kaynak: storagenewsletter/Cloudian basın bülteni; **fiyat/uygunluk doğrulanmadı**) | **[VARSAYIM]** değişken |
| D. AWS Istanbul Local Zone S3 | İstanbul (veri TR'de; bağlı bölge Frankfurt) | **Evet** | Veri Türkiye'de tutulabiliyor (Webrazzi, 20 Mayıs 2026) | Sağlayıcı yabancı şirket; "yurt dışı aktarım" değerlendirmesi **hukuki görüş ister**; "yurt dışı S3 yok" kararınla çelişebilir | Ücretli; fiyat doğrulanmadı |
| E. Ekipten birinin düzenli **elle indirip şifreli saklaması** (Coolify arşivini indir → `age`/`gpg` ile şifrele) | Kişisel cihaz/disk (TR) | Kısmen | Ek servis yok | İnsan disiplinine bağlı; kişisel cihazda kişisel veri riski; erişim kaydı zor | 0 TL |
| F. Yedeksiz (kabul edilen risk) | – | Hayır | En basit | Sunucu/disk kaybında tüm CV'ler gider; adaylardan yeniden başvuru istenir | 0 TL |

**Değerlendirmem (öneri, karar senin):** A tek başına yetmez. Hacim küçük olduğu ve "gereksiz altyapı kurma" ilken dikkate alınarak **A + B** (yerel yedek + ikinci TR sunucuya istemci tarafı şifreli kopya) mantıklı; ikinci bir TR sunucun yoksa geçici olarak **A + E** (haftalık elle şifreli indirme) ile başlayıp ihtiyaç doğunca B'ye geçilebilir. C ancak zaten bir S3-uyumlu TR hedefin varsa. D hukuki görüş gerektirir. Hangi sunucunun/sağlayıcının mevcut olduğunu bilmeden fiyat/uygunluk yazmadım.

## 7. Etkilenecek dosyalar (özet)

| Yeni | Değişen | Dokunulmayan |
|---|---|---|
| `cms/src/collections/JobApplications.ts` | `cms/src/payload.config.ts` (1 satır + import) | `Careers.ts`, `Media.ts`, `Users.ts`, `Projects.ts`, `TeamMembers.ts`, `Events.ts` |
| `cms/src/lib/cv/*`, `lib/http/*` | `cms/src/globals/CareersPageSettings.ts` (yeni grup, ek) | Mevcut global grupları |
| `cms/src/components/admin/RetentionBanner.tsx` | `cms/src/migrations/index.ts` + yeni migration (.ts/.json) | `seed.ts` (canlıda zaten çalıştırılmaz; opsiyonel olarak bayrak kapalı varsayılanı yeter) |
| `cms/tests/int/*.spec.ts` (4 dosya) | `cms/src/payload-types.ts`, `cms/src/app/(payload)/admin/importMap.js` (üretilmiş) | |
| `web/src/components/careers/ApplicationForm.tsx`, `FileDropzone.tsx` | `web/src/pages/CareersPage.tsx`, `services/api.ts`, `pages/KvkkPage.tsx`, stil dosyası | `FloatingCTA`, `CareerCTA`, `CareerCard`, `Navbar` |
| `web/src/types/application.ts` | `cms/.env*.example` (3 dosya), `ENVIRONMENTS.md`, `ROADMAP.md` | |
| `docs/KARAR_KARIYER_CV.md` | | |

---

## 8. Riskler (kalanlar)

| Risk | Etki | Azaltma |
|---|---|---|
| Anahtar kelime taraması gelişmiş gizlemeyi kaçırır | Zararlı PDF kabul edilebilir | ClamAV'a yer bırakıldı; CV'ler yalnızca admin tarafından, `attachment` olarak iner (tarayıcıda doğrudan açılmaz); aydınlatma/PR'da dürüst not |
| Yanlış pozitif (gerçek CV reddi) | Aday kaybı | Aşama 2 külliyat testi; hata mesajı anlaşılır; kural listesi dar |
| `validatePDF` (son 1 KB'ta `%%EOF`+`xref`) bazı PDF'leri reddeder | Aynı | Külliyat testi; sorun çıkarsa eşik uygulamada tartışılır (Payload kodu değiştirilmez) |
| Rol yok (Karar 4) | Tüm adminler tüm CV'leri görür | Bilinçli karar; PR notu; indirme logu ile izlenebilirlik |
| Migration canlıda otomatik çalışır | Hatalı migration kesinti | §4 prodcopy testi + DB yedeği + additive + bayrak kapalı |
| Volume/yedek olmadan açılış | CV kaybı | Bayrak varsayılan kapalı; Aşama 0 kapısı |
| `x-forwarded-for` güveni | Rate limit atlatılabilir | Son girdi + günlük DB sayacı + e-posta sınırı + honeypot |
| Bellek: 20 MiB'a kadar gövde tamponlama | RAM baskısı | `Content-Length` ön kontrolü + rate limit |
| Seed global'leri ezer (proje hafızası) | Yeni global alanları sıfırlanır | Seed canlıda **asla** çalıştırılmaz; bayrak varsayılanı kapalı olduğu için en kötü durum "form kapanır" |
| KVKK metni hukuki olarak eksik | Hukuki risk | Metinler taslak; yayın öncesi senin/danışmanın onayı |
| Test sırasında yanlışlıkla geliştirme DB'sine yazma | Yerel veri kaybı | Test DB koruması + hedef DB adı doğrulaması |

---

## 9. Commit planı (ROADMAP önekleri; `new_era_w_yusuf` dalı)

| # | Mesaj | İçerik |
|---|---|---|
| ✔ | `fix(web): point production API example to cms.localhostusak.tech` | **Yapıldı: `97fa203`** |
| 1 | `feat(cms): add job-applications collection with private PDF storage` | Aşama 1 |
| 2 | `feat(cms): add fail-closed CV scanner, filename and rate-limit helpers` | Aşama 2 |
| 3 | `feat(cms): add public apply endpoint for job applications` | Aşama 3 |
| 4 | `feat(cms): add retention settings and expired-CV admin banner` | Aşama 4 |
| 5 | `feat(cms): harden CV downloads and log access` | Aşama 5 |
| 6 | `feat(cms): add migration for job applications` (migration tek başına ayrı commit) | Aşama 6 |
| 7 | `feat(web): add career application form with drag-and-drop CV upload` | Aşama 7 |
| 8 | `docs: document CV pool decisions, env and storage` + KVKK metin commit'i | Aşama 8 |

Her commit sonunda `Co-Authored-By` satırı eklenir. Push/PR yalnızca sen istediğinde.

---

## 10. Onayını istediğim noktalar

1. Planın genel akışı ve aşama sırası uygun mu?
2. **Boşlar:** `[X yıl]` (geçici 2 yıl), volume durumu (geçici: yok), `N` — gerçek değerler?
3. §4.1: Canlı kopya yerine **yalnızca şema + `payload_migrations`** dökümü ile test etmeyi onaylıyor musun? (Alternatif: anonimleştirilmiş tam dump.)
4. Erişim logu v1 = yalnızca uygulama logu (DB tablosu yok) olur mu?
5. ~~Rate limit değerleri~~ **Karar verildi (5 Ekim 2026):** IP başına 15/gün, e-posta başına 1/gün, CAPTCHA yok.
6. Özellik bayrağı CMS global'inde (admin'den aç/kapa) olsun mu?
7. ~~S3~~ **Karar verildi:** yurt dışı S3 yok; TR içi seçenek kararı §6.1'de bekliyor.
8. "Hayır" dediğin madde varsa belirt; yoksa **"başla"** de, Aşama 0'ı panel adımlarıyla birlikte başlatayım (kod yazımı Aşama 0 kapısından sonra).
