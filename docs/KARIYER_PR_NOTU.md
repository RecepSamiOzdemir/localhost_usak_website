# PR Açıklaması Taslağı — Kariyer / CV Havuzu (FAZ 6)

> Dal: `new_era_w_yusuf` → `main`. Bayrak **varsayılan KAPALI**: merge + migration, bayrak açılana kadar kullanıcıya görünür bir şey değiştirmez.
> **Merge öncesi admin kontrol listesi:** [`docs/KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md`](./KARIYER_MERGE_ONCESI_ADMIN_KONTROL.md) — tamamlanmadan merge/bayrak yok.

## Ne eklendi
- **CMS:** `job-applications` koleksiyonu (`upload`, yalnızca giriş yapmış CMS kullanıcıları); anonim `POST /api/job-applications/apply` endpoint'i (multipart, 5 MB PDF); PDF doğrulama + aktif içerik tarayıcısı (JS/Launch/gömülü dosya/parola) ve sınırlar (nesne sayısı, iç içe derinlik); rastgele dosya adı; IP özeti (HMAC-SHA256); günlük IP/e-posta sınırı (DB) + dakikalık burst (bellek); honeypot + form süresi; indirme sertleştirme (`attachment`, `nosniff`, `no-store`) ve indirme logu; saklama süresi uyarısı (admin liste banner'ı); `CareersPageSettings → applicationForm` (bayrak, metinler, `retentionYears`, `consentVersion`).
- **Web:** `ApplicationSection`/`ApplicationForm`/`FileDropzone`, `careers-form.css`, tipler ve doğrulama yardımcıları; `CareersPage` içine bölüm (bayrak kapalıyken çizilmez).
- **KVKK:** CV'ye özel aydınlatma + açık rıza **taslağı** (sponsor/uygun firmalara aktarım, Türkiye'de sunucu, 2 yıl, 18 yaş, başkası adına başvuru yok). Ayrıntı: [`KARIYER_KVKK_ONERILER.md`](./KARIYER_KVKK_ONERILER.md).

## Değişen / eklenen dosyalar
- CMS: `src/collections/JobApplications.ts`, `src/globals/CareersPageSettings.ts`, `src/payload.config.ts`, `.gitignore`, `src/lib/cv/*` (`apply`, `download`, `filename`, `limits`, `options`, `retention`, `scanner`, `scanners/*`, `storage`), `src/lib/http/{clientIp,rateLimit}.ts`, `src/components/admin/RetentionBanner.tsx`, `src/app/(payload)/admin/importMap.js` ve `src/payload-types.ts` (üretildi), `src/migrations/20261005_163346_kariyer_cv_havuzu.{ts,json}` + `index.ts`, `tests/helpers/pdf.ts`, `tests/int/{cv-helpers,job-applications-apply}.int.spec.ts`.
- Web: `src/App.tsx`, `src/pages/CareersPage.tsx`, `src/services/api.ts`, `src/components/careers/*`, `src/styles/careers-form.css`, `src/types/application.ts`, `src/utils/applicationForm.ts`.
- Doküman: `docs/KARIYER_*.md`.

## Karar ve uyarılar
- Rol **eklenmedi**: tüm CMS kullanıcıları tüm CV'leri görebilir (admin onaylı, 5 Ekim 2026).
- Saklama 2 yıl; silme **elle**; otomatik silme yok (admin onaylı, 5 Ekim 2026).
- **Migration elle düzeltildi; yeniden üretilirse tekrar uygula:** (1) `down` sırası — `payload_locked_documents_rels` adımları `DROP TABLE job_applications CASCADE`'den önce; (2) `application_form_privacy_notice` çok satırlı varsayılanında üreticinin eklediği girinti kaldırılır (metin koddaki varsayılanla birebir). Not: aydınlatma/rıza varsayılan metinleri değişirse migration `.ts` ve `.json` içindeki varsayılanlar da aynen güncellenmeli.
- Migration **yalnızca lokalde** test edildi (Postgres 18.4; **canlı sürüm bilinmiyor**). Yalnızca ekleme yapar (DROP/DELETE/UPDATE yok); canlı şemayla birebir kıyas yapılmadı → admin yedeği zorunlu.
- Loglar (indirme, sessiz red, tarama uyarısı) container logundadır; redeploy/rotasyonda kaybolabilir.
- Dakikalık burst sayacı bellekte; redeploy'da sıfırlanır (günlük sınırlar DB'de).
- E-posta doğrulaması yok.
- PDF tarayıcı: JBIG2/JPX **yalnızca log** (reddedilmez); nesne > 20.000 / derinlik > 32 red. Eşikler tahmini (`limits.ts`).
- **ClamAV ertelendi** (RAM'e bağlı); tarama hata verirse başvuru reddedilir (fail-closed). CV'ler güvenli açılmalı (kontrol listesi §3.1).
- Production'da `CV_STORAGE_DIR` yoksa dosya yazımı reddedilir; `CV_IP_HASH_SECRET` yoksa ve bayrak açıksa başvuru reddedilir.
- Lint config bu PR'dan önce de bozuktu; dokunulmadı. `tests/int/api.int.spec.ts` çalıştırılmadı (varsayılan DB'ye bağlanır).
- CSRF listesi eklenmedi (endpoint anonim, çerez kullanmaz); CORS listesi mevcut canlı alan adlarını içeriyor (curl ile doğrulandı, gerçek canlı alan adlarından tarayıcı testi yapılmadı).

## Test
- Typecheck (CMS + web) temiz. Entegrasyon: `cv-helpers` + `job-applications-apply` **41/41** (geçici `_cvtest` DB, silindi; 7 Ekim 2026'da KVKK metin değişikliğinden sonra yeniden koşuldu). Gerçek Chrome ile form akışı, 11+ örnek PDF, elle admin testi (bkz. devir notu).

## Merge sonrası / form açılmadan önce (açık işler)
- [ ] **Yedek stratejisi** kararı (plan §6.1; yurt dışı S3 yok) ve sorumlu.
- [ ] **KVKK hukuki inceleme** (aydınlatma + rıza; ayrı aktarım rızası gerekir mi; `/kvkk` önerileri). Onaysız bayrak açılmaz.
- [ ] **Yanlış pozitif testi:** 12–17'nin kalanı — Word, Pages, Mac "PDF olarak kaydet", **Canva**, **LinkedIn** (yalnızca Google Docs ölçüldü).
- [ ] **ClamAV** kararı (RAM'e bağlı).
- [ ] **Canlı Postgres sürümü** öğrenilmeli (migration yerelde 18.4'te denendi).
- [ ] **Cloudflare/benzeri proxy eklenirse** IP okuma (`x-forwarded-for` son değer) yeniden düzenlenmeli; aksi hâlde IP sınırı yanlış IP'ye uygulanır.
- [ ] Web `VITE_API_URL` mutlak (`https://cms.localhostusak.tech/api`) ve yeniden build (kontrol listesi §2.5.1).
- [ ] `/kvkk` sayfası güncellemesi (öneriler: `KARIYER_KVKK_ONERILER.md` §3).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
