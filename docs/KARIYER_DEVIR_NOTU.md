# Kariyer / CV Havuzu (FAZ 6) — Devir Notu (son güncelleme: 7 Ekim 2026)

Dal: `new_era_w_yusuf`. **Git durumu (13 Ekim 2026):** CV havuzu commit'leri push'landı (3 commit: `7a7ade2` CMS, `7dfa4e9` kariyer formu, `3b7f24a` docs). **PR açılmadı** (CV havuzunda yapılacak işler sürüyor). 13 Ekim 2026'da `origin/main` (sponsor işi dahil, PR #11) bu dala merge edildi (`eda99d6`, çakışma yok), web typecheck + vite build ve CMS typecheck temiz, dal push'landı. Form bayrağı (`applicationForm.enabled`) KAPALI bekliyor. Dokümanlar: `docs/KARIYER_ARASTIRMA.md`, `docs/KARIYER_UYGULAMA_PLANI.md`, `docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md`.

## Tamamlanan aşamalar (hepsi `localhostusak-cms/` altında)
- **Aşama 1 — koleksiyon:** `src/collections/JobApplications.ts`, `src/lib/cv/storage.ts`, `src/lib/cv/limits.ts`, `src/payload.config.ts`, `.gitignore`
- **Aşama 2 — tarayıcı/yardımcılar:** `src/lib/cv/scanner.ts`, `src/lib/cv/scanners/{types,index,pdfActiveContent}.ts`, `src/lib/cv/filename.ts`, `src/lib/http/clientIp.ts`, `src/lib/http/rateLimit.ts`, `tests/int/cv-helpers.int.spec.ts`
- **Aşama 3 — endpoint:** `src/lib/cv/apply.ts`, `src/lib/cv/options.ts`, `src/globals/CareersPageSettings.ts`, `src/payload-types.ts`, `tests/helpers/pdf.ts`, `tests/int/job-applications-apply.int.spec.ts`
- **Aşama 5 — indirme sertleştirme + erişim logu:** `src/lib/cv/download.ts` (yeni), `src/collections/JobApplications.ts` (`upload.modifyResponseHeaders`, `upload.handlers`), `tests/int/job-applications-apply.int.spec.ts` (+1 test). Başlıklar: `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`. Log: `[cv] indirme kullanici=<id> basvuru=<id> zaman=<ISO>`. Anonim erişim 403 (testle doğrulandı). Sapma: Payload, erişim kuralı `true` dönünce handler'a `doc` iletmiyor; başvuru id'si rastgele dosya adından aranıyor. Range isteği başına bir log satırı düşer (tarayıcı indirmesi normalde tek istek).
- **Aşama 4 — saklama/admin uyarısı/form metinleri:** `src/lib/cv/retention.ts`, `src/components/admin/RetentionBanner.tsx`, `src/collections/JobApplications.ts` (`beforeListTable`), `src/globals/CareersPageSettings.ts` (`title`, `intro`, `privacyNotice`, `consentText`, `retentionYears`, `successMessage`), `src/app/(payload)/admin/importMap.js` (üretildi), `src/payload-types.ts` (üretildi), `tests/int/cv-helpers.int.spec.ts`
- Son durum (5 Ekim 2026): typecheck temiz; birim 20/20, endpoint 13/13 (geçici `_cvtest` DB, silindi; Aşama 5 sonrası toplam 33/33). Banner gerçek admin ekranında henüz görülmedi.
- **Aşama 6 — migration + lokal test (5 Ekim 2026):** `src/migrations/20261005_163346_kariyer_cv_havuzu.{ts,json}`, `src/migrations/index.ts` (Payload üretti). up: 3 `CREATE TYPE`, 2 `CREATE TABLE` (`job_applications`, `job_applications_fields_of_interest`), `careers_page_settings`'e 8 `ADD COLUMN` (hepsi NULL'a açık + DEFAULT; bayrak `false`), `payload_locked_documents_rels`'e nullable `job_applications_id`, 2 FK, 7 index (1'i unique `filename`). up'ta DROP/DELETE/UPDATE/TRUNCATE/ALTER COLUMN/RENAME/SET NOT NULL yok. down yalnızca bunları geri alır.
  - **Elle düzeltme 1 (down):** üretilen sırada `DROP TABLE job_applications CASCADE` FK'yı düşürüyor, sonraki `DROP CONSTRAINT` hata veriyordu (testte yakalandı, transaction geri sardı). `payload_locked_documents_rels` adımları öne alındı (`add_team_members`'taki kalıp).
  - **Elle düzeltme 2 (up):** üretici çok satırlı `application_form_privacy_notice` varsayılanının devam satırlarına 2 boşluk girinti ekliyordu → canlıdaki mevcut satıra girintili metin yazılır, DB varsayılanı kodla uyuşmazdı (dev push farkı gösterdi). Girinti kaldırıldı; metin snapshot/kod varsayılanıyla birebir (1688 karakter). Dosyada "girintilemeyin" yorumu var.
  - Test (geçici `localhostusak_cvtest`, silindi; düzeltmelerden sonra sıfırdan tekrarlandı): son snapshot ↔ 6 migration şeması tutarlı; sahte satırlar (`careers_page_settings`, 5 global, 2 `careers` ilanı) migrate/down/migrate boyunca korundu; down sonrası şema `pg_dump` ile 6-migration haline birebir; `payload_migrations` yeni kayıt batch 2. `NODE_ENV=production` build (izole kopyada, port 3100) + migration geri alınıp **açılışta `prodMigrations` ile uygulandı**; `/admin` (create-first-user), `/kariyer` (headless Chrome, sahte ilan görünür, konsol hatası yok), `/api/job-applications/apply` → 503 `disabled`, anonim `GET /api/job-applications` → 403. Migration şeması üzerinde testler 33/33; dev push şemada fark bulmadı; typecheck temiz; `payload-types.ts` güncel.
  - Not: yerel Postgres 18.4 (plan 16 varsaymıştı); canlı sürüm bilinmiyor (PR notu). `tests/int/api.int.spec.ts` çalıştırılmadı (varsayılan `DATABASE_URL`'e bağlanır).
- **Aşama 7 — web formu (5 Ekim 2026), hepsi `localhostusak-web/` altında:** `src/types/application.ts` (yeni; tipler + CMS ile aynı olması gereken sabitler), `src/utils/applicationForm.ts` (yeni; `{{...}}` çözümleme + istemci doğrulaması), `src/components/careers/{ApplicationSection,ApplicationForm,FileDropzone}.tsx` (yeni), `src/styles/careers-form.css` (yeni, `App.tsx`'te import), `src/services/api.ts` (`applicationForm` tipi, `submitJobApplication`, `isDirectCmsApi`), `src/pages/CareersPage.tsx` (`<ApplicationSection>` listeden sonra, kaynaklardan önce). **CMS'te hiçbir dosya değişmedi.**
  - Bayrak kapalıysa bölüm hiç çizilmez. Başlık/giriş/aydınlatma/rıza/başarı metni CMS'ten; `{{retentionYears}}` → `retentionYears`. Çözülemeyen `{{...}}` (bilinmeyen ad, boş/kesirli süre) ya da boş aydınlatma/rıza metni → form gösterilmez + konsola `[kariyer]` uyarısı.
  - Gönderim: tarayıcıdan `fetch(${VITE_API_URL}/job-applications/apply)`, `FormData`, `credentials:'omit'`, Content-Type elle konmaz, 60 sn zaman aşımı. Honeypot alanı `website` (ekran dışı, `tabIndex=-1`, `aria-hidden`), `formStartedAt` = form açılış anı (epoch ms).
  - Sapma (kural uygulaması): production derlemesinde `VITE_API_URL` mutlak değilse (göreli `/api` = frontend proxy'si) form gösterilmez + konsol uyarısı (`isDirectCmsApi`). Gerekçe: proxy üzerinden gelen başvurular CMS'te tek IP görünür, günlük IP sınırı herkesi engeller. Geliştirmede göreli `/api` serbest (yalnızca yerel deneme).
  - Sapma: seçenekler/alan adları/5 MB sınırı web'de CMS'ten kopyalandı (paketler birbirini import etmez; kaynak dosyalar `types/application.ts` başında yazılı). CMS'te değişirse web'de de elle güncellenir.
  - Plan gereği `FloatingCTA` ve `CareerCTA` değiştirilmedi.
  - CORS/CSRF sonucu: bkz. aşağıdaki "Aşama 7 bulguları".
  - Test (gerçek Chrome, headless; web 5174 → CMS 3101 production build + `_cvtest`): form görünümü, `{{retentionYears}}`→2, boş gönderimde ağ isteği yok + odak/aria, tür/boyut hataları, sürükle-bırak, gönderim sırasında buton kilidi, doğrudan CMS adresi, multipart, başarı + form temizleme, DB kaydı (ipHash 64, rıza sürümü, rastgele dosya adı, dosya diskte), hibrit/parolalı PDF mesajları, 429 mesajı, sunucu `fields` → alan hatası + odak, ağ hatası, JSON olmayan 502, klavye (honeypot odağa girmez, Space ile dosya seçici), bayrak kapalı/`{{foo}}`/süre boş, iki tema × masaüstü/mobil (yatay taşma yok), production derlemesi (mutlak API → form var; göreli API → form yok + uyarı). Hepsi geçti. Typecheck (CMS + web) temiz; CMS testleri 33/33.
  - Bulunup düzeltilen hata: sunucu `fields` döndüğünde odak alana gitmiyordu (alanlar o an `disabled`); odak artık yeniden çizimden sonra veriliyor.

- **Düzeltme turu (6 Ekim 2026, kullanıcı isteği):** (1) Honeypot alan adı `website` → `q7zk_x2m` (CMS `FORM_FIELDS.honeypot` + web `APPLICATION_FIELDS.honeypot`); web'de `autocomplete=off`, `tabIndex=-1`, `aria-hidden`, `inert`, `data-1p-ignore`/`data-lpignore`/`data-form-type`, etiket "Bu alanı boş bırakın". (2) `formStartedAt` (epoch ms) kaldırıldı; yerine `fillMs` (formun açık kaldığı süre, istemcide `performance.now()` farkı). Sunucu yalnızca bu süreye bakar: `< 3000` (negatif dahil) → honeypot gibi sessiz 201; çok büyük değer reddedilmez; alan eksik/boş/sayı değilse `invalid_request` (400). (3) Sessiz red logu: tek satır `[cv] başvuru yok sayıldı sebep=honeypot` veya `sebep=fill_too_fast`. Değişen: `localhostusak-cms/src/lib/cv/apply.ts`, `tests/int/job-applications-apply.int.spec.ts` (honeypot testi genişletti + 1 yeni test), `localhostusak-web/src/types/application.ts`, `src/components/careers/ApplicationForm.tsx`, `docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md` (§2.5, yeni §2.5.1 `VITE_API_URL`, §4 bot koruması). Test: CMS 34/34, typecheck (CMS+web) temiz; gerçek Chrome'da cihaz saati ±1 gün iken başvuru KAYDEDİLDİ, `performance.now()` sabit (0 ms) iken sessiz başarı + kayıt yok + log `fill_too_fast` (e-posta/IP yok); önceki tarayıcı kontrolleri yeniden geçti.
- **13 Ekim 2026 — JBIG2/JPX reddi uygulandı (commit YOK):** `limits.ts` (`'reject'`), `apply.ts` (mesaj), `scanners/types.ts` (yorumlar), `tests/int/cv-helpers.int.spec.ts` (JBIG2/JPX artık red + "warn" moduyla uyarı testi + red önceliği testi), `tests/int/job-applications-apply.int.spec.ts` (uç nokta: 400 `scanned_pdf`, kayıt yok, log yalnızca sebep). Test: temiz geçici `_cvtest` DB'sinde birim + endpoint 42/42, typecheck temiz, DB silindi. Not: endpoint testleri her koşuda SIFIR DB ister (günlük IP/e-posta sınırı artığı 2 testi düşürür). Taranmış CV'ler artık reddedilir; yanlış pozitif ölçümünde (Word/Pages/Mac yazdır/Canva/LinkedIn) çıktının JBIG2/JPX içerip içermediği de gözlenmeli.

- **13 Ekim 2026 — JBIG2/JPX yanlış pozitif ölçümü:** Dijital araç çıktıları (Canva, Google Docs, Mac yazdır) test edildi: hiçbirinde JBIG2/JPX yok, `scanCv` hepsini kabul ediyor (uyarı da yok). Taranmış CV'ler bilinçli reddediliyor. Telefon taraması ve Word/LinkedIn ölçülmedi; karar taranmışı zaten reddetmek olduğu için bu bayrak açılışını bloke etmiyor. Red türü adı `risky_codec` → `scanned_pdf` olarak değiştirildi (yanıt kodu ve log `sebep=scanned_pdf`; kodek adı sızmaz).

## Onaylanan kararlar ve sapmalar
- Tek koleksiyon (`job-applications`, `upload: true`); dosya ve kayıt yalnızca giriş yapmış CMS kullanıcılarına açık.
- Rol yok; tüm CMS kullanıcıları CV görebilir (admin onaylı).
- Saklama 2 yıl (aydınlatmada üst süre); otomatik silme yok, silme elle; panel yalnızca uyarır (admin onaylı).
- ClamAV yok; Payload `validatePDF` + aktif içerik tarayıcısı + 5 MB + rastgele dosya adı; her hata → red (fail-closed).
- Hibrit (gömülü dosyalı) ve parola/izin korumalı PDF → red + Türkçe yönlendirme mesajı; `active` → genel mesaj.
- Production'da `CV_STORAGE_DIR` yok/göreli → dosya yazılmaz (yerel varsayılana düşülmez); bayrak açıksa 503.
- `ipHash` = HMAC-SHA256(IP, `CV_IP_HASH_SECRET`); production'da anahtar yoksa ve bayrak açıksa 503.
- Rate limit: IP 15/gün, e-posta 1/gün (DB'den); burst 3/dk bellekte (redeploy'da sıfırlanır, kabul edildi).
- Özellik bayrağı `careers-page-settings.applicationForm.enabled`, varsayılan KAPALI.
- Erişim logu v1 = uygulama logu (redeploy'da kaybolabilir; PR notu). Loglarda yalnızca id + sebep kodu.
- Sapma: bayrak + `consentVersion` Aşama 3'te eklendi (Aşama 4 yerine).
- Sapma: multipart native `req.formData()` ile okunuyor (`addDataAndFileToRequest` değil).
- Sapma: e-posta sınırı genel 429 mesajıyla (başvuru varlığı sızmasın).
- Sapma: `too_large`/`validation`/`consent_missing`/`file_missing` yönlendirici mesaj; `invalid` genel.
- Sapma: ayrı 18 yaş alanı yok; beyan rıza metninde olacak (Aşama 4).
- Bilinen sınır: eşzamanlı aynı e-posta yarışı kabul edildi.
- Lint config bu PR'dan önce de bozuktu; dokunulmadı (PR notu).

## Kapanan sorular
- **Proxy (kapandı, 5 Ekim 2026):** Cloudflare yok (NS: dnsenable.com, yanıtlarda `cf-ray` yok); CMS önünde yalnızca Coolify/Traefik var. `x-forwarded-for`'un son değerini okuyan mevcut kod doğrulandı, değişmeyecek.
- **Sunucu konumu:** Türkiye (Keyubu VDS). KVKK metinleri Aşama 8'de buna göre yazılacak; mevcut `/kvkk` §5'teki "yurt dışında yer alabilir" ifadesi için öneri sunulacak.

## Açık sorular / açık işler
- **KVKK metinleri hukuki inceleme bekliyor:** aydınlatma ve rıza metinleri TASLAK; hukuki onay olmadan bayrak açılmaz.
- **Yedek stratejisi:** TR içi seçenekler plan §6.1'de; karar bekliyor (yurt dışı S3 yok).
- **Yanlış pozitif (JBIG2/JPX):** Canva, Google Docs, Mac yazdır ölçüldü, temiz (13 Ekim 2026). Word, LinkedIn, Pages, telefon taraması ölçülmedi; taranmış CV reddi bilinçli karar olduğundan bayrağı bloke etmiyor.
- **ClamAV:** RAM'e bağlı; karar bekliyor (şu an yok, bkz. onaylanan kararlar).
- **Canlı Postgres sürümü:** bilinmiyor (yerel 18.4); PR notuna yazılacak.

## Sıradaki iş
- **Aşama 1–7 bitti ve kullanıcı tarafından onaylandı (6 Ekim 2026).** Geçici test ortamı kapatıldı (aşağıya bak).
- **1) PDF tarayıcı sıkılaştırma — UYGULANDI ve ölçüldü (6 Ekim 2026). Commit yok.** Ayrıntı: aşağıdaki "PDF tarayıcı sıkılaştırma" bölümü.
- **2) Aşama 8 — UYGULANDI (7 Ekim 2026), onay bekliyor. Commit/PR yok.** `CareersPageSettings.ts` aydınlatma ve rıza **taslağı** tamamlandı (firmalara/sponsorlara aktarım, Türkiye'de sunucu/yurt dışı yok, 18 yaş, başkası adına başvuru yok, haklar); "Kimler görebilir" paragrafı firma aktarımıyla çeliştiği için yeniden yazıldı. Varsayılanlar migration `.ts`/`.json` içine de aynen işlendi. Yeni dosyalar: `docs/KARIYER_KVKK_ONERILER.md` (KVKK çelişki listesi + `/kvkk` önerileri), `docs/KARIYER_PR_NOTU.md` (PR açıklaması taslağı). `KvkkPage.tsx` değiştirilmedi. Yer tutucu yalnızca `{{retentionYears}}`. Typecheck temiz; CMS testleri 41/41 (geçici `_cvtest` DB, silindi). Açık: ayrı aktarım rızası gerekir mi (hukuki), `/kvkk` güncellemesi, `consentVersion` `cv-v1` kaldı.
- Migration dosyası yeniden üretilirse iki elle düzeltme (down sırası, privacy_notice girintisi) tekrar uygulanmalı.
- **Aşama 8 / bayrak öncesi zorunlu:** KVKK metinleri hukuki inceleme; `{{...}}` kalmadığı kontrolü (web artık kalırsa formu göstermez); yanlış pozitif Word/Pages/Mac yazdır/Canva/LinkedIn; web `VITE_API_URL` mutlak (checklist §2.5.1); yedek stratejisi; admin kontrol listesi.
- RetentionBanner gerçek admin ekranında görüldü (6 Ekim 2026 elle test: "1 yeni başvuru" uyarısı).

## PDF tarayıcı sıkılaştırma (6 Ekim 2026)
- **Ölçüm (11 örnek):** JBIG2/JPX yok; nesne en çok 151; iç içe derinlik en çok 4; xref hepsinde sağlam. `/Size` güvenilmez (02'de 19704, gerçek 22 nesne).
- **Kararlar (kullanıcı onaylı):** JBIG2/JPX log-only (reddetme yok); xref kuralı YOK (log bile yok); nesne sayısı log ≥3.000 / red >20.000 (`invalid`, genel mesaj); iç içe derinlik red >32 (`invalid`). Öncelik: active > encrypted > embedded > sınırlar > uyarılar.
- **Eşikler:** hepsi `src/lib/cv/limits.ts` içinde (`PDF_OBJECT_WARN_COUNT`, `PDF_OBJECT_MAX_COUNT`, `PDF_MAX_NESTING_DEPTH`, `PDF_RISKY_CODEC_ACTION`). Tahmini; log toplandıkça gözden geçirilecek. **13 Ekim 2026 kararı: `PDF_RISKY_CODEC_ACTION='reject'`** — JBIG2/JPX içeren PDF `scanned_pdf` (400) ile reddedilir (yukarıdaki "JBIG2/JPX log-only" kararı GEÇERSİZ). Mesaj: "CV'niz taranmış veya fotoğraf tabanlı bir biçimde görünüyor. Lütfen CV'nizi Word, Google Docs veya Canva gibi bir programdan PDF olarak kaydedip yeniden yükleyin." Öncelik değişmedi (active > encrypted > embedded > nesne/derinlik sınırları > scanned_pdf). Log: `[cv] başvuru reddedildi sebep=scanned_pdf` (kodek adı/kişisel veri yok). Geri almak için sabit `'warn'` yapılır (uyarı yolu ve testi duruyor).
- **Değişen dosyalar (CMS):** `src/lib/cv/limits.ts`, `src/lib/cv/scanners/types.ts` (`ScanWarningCode`, `warnings`, `scanned_pdf`), `src/lib/cv/scanners/pdfActiveContent.ts`, `src/lib/cv/scanner.ts` (uyarıları birleştirir), `src/lib/cv/apply.ts` (uyarı logu, `scanned_pdf` mesajı), `tests/helpers/pdf.ts`, `tests/int/cv-helpers.int.spec.ts`, `tests/int/job-applications-apply.int.spec.ts`. `docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md`: §3.1 "CV'leri güvenli açma" + §4 satırı.
- **Log:** `[cv] basvuru=<id> uyari=many_objects` (kayıt sonrası; `jbig2`/`jpx` uyarısı yalnızca sabit `'warn'` iken); kayıt oluşmazsa `[cv] uyari=…`. Kişisel veri yok.
- **Test:** typecheck temiz; birim + endpoint 41/41 (geçici `localhostusak_cvtest`, silindi). Mevcut 11 örnek scanCv'den geçirildi: 01/03/04/05/06/09/10 kabul, 02 `embedded`, 07/08/11 `encrypted`; uyarı yok → davranış değişmedi.
- **Sentetik ölçüm TAMAMLANDI (6 Ekim 2026):** `~/cv-ornekleri/31-jpx-jpeg2000.pdf` (gerçek) → kabul + `jpx` uyarısı; bellekte üretilen sentetik `/JBIG2Decode` PDF → kabul + `jbig2` uyarısı; 11 örnek davranışı değişmedi. Gerçek JBIG2 tarama dosyası indirilemedi (yalnızca sentetik test edildi). Ölçüm betiği silindi. Kullanıcı doğrudan scanCv üzerinden ölçtü; JPX'in endpoint logu ayrıca denenmedi.

## Aşama 7 bulguları (PR notuna girecek)
- **CORS:** `payload.config.ts` `cors` listesi canlı alan adlarını (`localhostusak.tech`, `www.localhostusak.tech`, `localhostusak.com`, `www.localhostusak.com`) ve yerel adresleri içeriyor. curl: bu adreslerin hepsi için hem preflight (OPTIONS) hem POST (400 hata yanıtı dahil) `Access-Control-Allow-Origin` döndürüyor; listede olmayan adreslere dönmüyor. Gerçek Chrome: izinli köken (5174, yalnızca test kopyasında listeye eklendi) → POST 201 okunabildi; listede olmayan köken (5175) → CORS engeli. `multipart/form-data` "basit" istek olduğu için tarayıcı preflight bile göndermez. **Repodaki `payload.config.ts`'e dokunulmadı; wildcard yok.** Not: gerçek canlı adreslerden (localhostusak.tech vb.) tarayıcı testi yapılamadı; yalnızca başlık düzeyinde (curl) doğrulandı.
- **CSRF:** `csrf` ayarı config'te yok → Payload varsayılanı `[]` (boş = çerezle kimlik doğrulaması her kökenden kabul). Başvuru endpoint'i anonim (`overrideAccess`, çerez kullanmaz) olduğu için CSRF listesi bu akış için gerekmiyor; **eklenmedi**. Dikkat: `csrf` listesi doldurulursa CMS'in kendi adresi (`https://cms.localhostusak.tech`) de içinde olmalı, yoksa admin girişi bozulur; bu yüzden "yalnızca gerekli olanı ekle" kuralıyla bırakıldı. İstersen ayrı bir sertleştirme işi olarak ele alınır.
- **Bilinen sınırlar:** Mevcut `CareersPage`'teki `spin` animasyonu projede tanımlı değil (önceden de dönmüyordu, dokunulmadı; forma kendi `application-spin`'i eklendi). Honeypot ve saat kayması sorunları 6 Ekim 2026 düzeltmesiyle giderildi (aşağıda).
- Elle test sonuçları (6 Ekim 2026, kullanıcı): 01 kabul + başarı + form temizlendi; admin kaydı + "1 yeni başvuru" uyarısı; dosya adında aday adı yok; anonim dosya erişimi reddedildi; girişli indirme diske indi (tarayıcıda açılmadı); JS gömülü 4 PDF reddedildi; 02/07/08/11 doğru mesajla reddedildi; Google Docs çıktısı kabul edildi.
- `~/cv-ornekleri/` dizini yok; örnekler `~/Desktop/cv-ornekleri.zip` içinde (01–11; 12–17 yok).

## Aşama 7 geçici test ortamı — KAPATILDI (6 Ekim 2026)
- Silinenler: 3101 (test CMS) ve 5174 (test web) süreçleri; `localhostusak_cvtest` DB'si; test scratchpad'inin tamamı (CMS kopyası, `cv_storage/` içindeki yüklenmiş test CV'leri, açılmış örnek PDF'ler, betikler, loglar, `token.txt`).
- Dokunulmayanlar: 3000/5173 (kullanıcının süreçleri), ana geliştirme DB'si `localhostusak`, `localhostusak_migtest*`, `.next`. Repo'ya hiçbir geçici dosya yazılmamıştı.
- Örnek PDF'lerin kaynağı `~/Desktop/cv-ornekleri.zip` (repo dışı, silinmedi); yeni ölçümde yeniden açılır.
- Yeni test gerekirse: yeni geçici DB (`_cvtest` soneki), iş bitince silinir.
## Aşama 7 kuralı (web formu)
- Form başvuruyu **tarayıcıdan doğrudan** CMS'teki `/api/job-applications/apply` adresine gönderir. Frontend sunucusu (server action, API route, proxy vb.) üzerinden iletilmez: aksi hâlde CMS tüm başvuruları tek IP'den görür ve günlük IP sınırı (15/gün) herkesi engeller.
- Doğrudan gönderim mümkün değilse (CORS, alan adı vb.) uygulamadan önce kullanıcıya sorulur.

## Çalışma kuralları
- Commit yok (kullanıcı istemedikçe). Her aşama sonunda onay kapısı.
- `npm run dev` ana geliştirme DB'sinde çalıştırılmaz; gerekirse geçici DB, iş bitince silinir.
- Test DB'leri `_cvtest` ile biter ve iş bitince silinir (`localhostusak_migtest*` DB'lerine dokunulmaz).
- Kod yorumları Türkçe; yeni paket yok; canlı ortama bağlanılmaz.

## Model kuralları
- Fable/Mythos katmanı kullanılmaz.
- Alt ajan başlatılmaz; gerekirse önce sorulur, onaylanırsa alt ajan Sonnet 5.5 kullanır.
- Bu kısıtlar alt ajanlar (fork, workflow, derin-analiz) için de geçerlidir.
