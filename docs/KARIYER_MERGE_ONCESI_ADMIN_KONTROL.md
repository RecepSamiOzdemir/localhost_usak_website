# Kariyer / CV Havuzu — Merge Öncesi Admin Kontrol Listesi

- **Kim yapar:** Proje admini (Coolify/SSH/canlı DB erişimi olan kişi). Geliştirici bu adımlara erişemez.
- **Ne zaman:** `new_era_w_yusuf` → `main` merge'inden **önce**. PR açıklaması bu dosyaya referans verir.
- **Güvenlik ilkesi:** Özellik bayrağı (`CareersPageSettings → applicationForm.enabled`) **varsayılan KAPALI** gelir. Merge + migration, bayrak açılana kadar kullanıcıya görünür hiçbir şey değiştirmez. Aşağıdaki adımlar tamamlanmadan bayrağı **açmayın**.
- **Kural: Volume, `CV_STORAGE_DIR` ve `CV_IP_HASH_SECRET` tanımlanmadan bayrak açılmaz.** Production'da `CV_STORAGE_DIR` yoksa sistem CV dosyası yazmayı reddeder (yerel dizine düşmez); bayrak açılırsa başvurular 503 ile reddedilir.
- Arayüz adları Coolify dokümanına göre yazıldı; sürümünüzde küçük farklar olabilir.

## 1. Merge öncesi (zorunlu)

### 1.1 Canlı DB yedeği
1. Coolify → Projects → proje → **PostgreSQL** kaynağı → **Backups**.
2. Zamanlama yoksa **+ Add** → `daily` → **Save**.
3. Zamanlamayı aç → **Backup Now**.
4. Durum *Success*, boyut > 0 olmalı. (Dosya sunucuda `/data/coolify/backups`.)
5. Not: Migration yalnızca ekleme yapar; yedek yine de zorunlu.

### 1.2 Migration kontrolü
Merge'den sonra container açılışında migration otomatik çalışır (`prodMigrations`). Kontrol: Deploy logunda migration hatası yok; admin panelinde **Job Applications** koleksiyonu görünür.

## 2. Bayrağı açmadan önce (zorunlu)

### 2.1 CV volume'u
1. Coolify → CMS uygulaması → **Configuration → Persistent Storage → Add → Volume Mount**.
2. Name: `cv-applications` · Source Path: boş · Destination Path: `/data/cv-applications` → **Add**.
3. **Configuration → Environment Variables → Add:** `CV_STORAGE_DIR` = `/data/cv-applications` (runtime; gizli değil).
4. **Aynı ekranda → Add:** `CV_IP_HASH_SECRET` = rastgele uzun değer (örn. sunucuda `openssl rand -hex 32` ile üretin). **Gizli** olarak işaretleyin, runtime; `NEXT_PUBLIC_` öneki **almaz**, hiçbir yere yazılmaz/paylaşılmaz. Production'da tanımsızsa başvurular fail-closed reddedilir. Değiştirilirse günlük IP sayaçları sıfırlanmış olur (eski özetler eşleşmez).
5. **Redeploy**.

### 2.2 Kalıcılık ve yazma testi (Terminal)
```
id; ls -ld /data/cv-applications
echo test > /data/cv-applications/.persist-test && ls -la /data/cv-applications
```
`Permission denied` varsa bayrağı açmayın; çıktıyı geliştiriciye iletin. Sonra bir kez daha **Redeploy** edip dosyanın durduğunu doğrulayın, ardından `rm /data/cv-applications/.persist-test`.

### 2.3 Yedek stratejisi (karar gerekli)
`docs/KARIYER_UYGULAMA_PLANI.md` §6.1'deki seçeneklerden birini seçin (yurt dışı S3 kullanılmayacak). Seçilen yöntem ve sorumlu kişi buraya yazılsın: `__________`.
Coolify volume yedeği seçilirse: uygulama → Configuration → Persistent Storage → `cv-applications` → **Configure Backup** (daily, 14 yedek). Panelden geri yükleme yoktur; arşiv indirilir. Arşivler şifresizdir.

### 2.4 Saklama süresi ve hukuki metin
**Karar (admin onaylı, 5 Ekim 2026):** üst süre **2 yıl**; otomatik silme yok, silme elle; panel süre dolunca yalnızca uyarı verir. Değer CMS'te *Kariyer Sayfası Ayarları → Başvuru Formu → Saklama Süresi (yıl)* alanındadır. Aydınlatma/rıza metninin hukuki onayı bayrak açılmadan önce yapılmalıdır.

- **Form açılmadan önce** Kariyer Sayfası Ayarları'ndaki aydınlatma ve rıza metinlerinde `{{...}}` (ör. `{{retentionYears}}`) kalmadığı kontrol edilecek. Yer tutucuyu web formu (Aşama 7) değiştirir; formda ham `{{...}}` görünüyorsa bayrağı açmayın.

### 2.5 Yanlış pozitif testi (zorunlu)
Bayrak açılmadan önce **Word, Pages, Mac "PDF olarak kaydet" (yazdır), Canva ve LinkedIn** çıktılarıyla yanlış pozitif testi yapılacak. Örnek 12–17 içinden **yalnızca Google Docs test edildi ve kabul edildi (6 Ekim 2026); Word, Pages, Mac yazdır, Canva, LinkedIn hâlâ ölçülmedi — bayrak açılmadan önce zorunlu.** 01–11 örnekleri 5 Ekim 2026'da ölçüldü: beklentiyle uyumlu. Gömülü dosyalı (hibrit) ve parola/izin korumalı PDF'ler bilinçli olarak reddedilir, kullanıcıya yönlendirme mesajı gösterilir.

### 2.5.1 Web uygulaması `VITE_API_URL` (zorunlu)
Coolify'da **web (frontend) uygulamasının** `VITE_API_URL` değeri **mutlak adres** olmalı: `https://cms.localhostusak.tech/api`. Göreli (`/api`) ya da boşsa form **canlıda görünmez** (tarayıcı konsolunda `[kariyer] CV başvuru formu gösterilmedi: VITE_API_URL mutlak…` uyarısı çıkar). Gerekçe: başvuru tarayıcıdan doğrudan CMS'e gitmeli; frontend proxy'si üzerinden geçerse CMS tüm başvuruları tek IP'den görür ve günlük IP sınırı herkesi engeller. Bu değer build sırasında gömülür; değiştirirseniz web uygulamasını **yeniden build** edin. Kontrol: bayrağı açtıktan sonra `/kariyer` sayfasında form görünmeli.

### 2.6 Eski yedek betiği
`deploy/backup-db.sh` canlıda cron'da çalışıyor mu? (`crontab -l`) Çalışıyorsa 7 gün saklama, silinen aday kaydının eski dump'larda kalabileceği anlamına gelir.

## 3. Bayrağı açtıktan sonra
1. Test başvurusu yapın (kendi e-postanızla, zararsız PDF). Admin panelinde kayıt ve dosya görünmeli.
2. Aynı dosyaya **anonim** erişimin reddedildiğini doğrulayın (gizli sekmede dosya URL'si → 403).
3. Bir redeploy sonrası dosyanın durduğunu doğrulayın.
4. Girişliyken CV indirin: dosya tarayıcıda açılmamalı, indirilmeli; container logunda tek satır `[cv] indirme kullanici=… basvuru=…` görünmeli (ad/e-posta/IP yok).
5. Test kaydını elle silin; dosyanın da gittiğini kontrol edin.

### 3.1 CV'leri güvenli açma (CMS'e giriş yapan herkes için)
Sunucudaki tarama antivirüs değildir; yalnızca bilinen aktif içerik anahtarlarını arar. Son savunma, CV'yi açan bilgisayardır:
1. **CV'leri güncel bir tarayıcının yerleşik PDF görüntüleyicisiyle açın** (Chrome, Edge veya Firefox; tarayıcıyı güncel tutun). **Adobe Reader/Acrobat ile açmayın.**
2. Adobe kullanmak zorundaysanız önce JavaScript'i kapatın: *Düzenle → Tercihler → JavaScript → "Acrobat JavaScript'i etkinleştir" işaretini kaldırın* (Windows) veya *Acrobat → Tercihler → JavaScript* (macOS). Koruma modu (Protected Mode) de açık kalmalı.
3. CV'yi açan bilgisayarda **antivirüs açık ve güncel olmalı** (Windows'ta Microsoft Defender yeterlidir; gerçek zamanlı koruma açık).
4. İndirilen dosyayı çift tıklayıp varsayılan uygulamayla açmayın; tarayıcıya sürükleyin veya "Birlikte aç → tarayıcı" seçin. Varsayılan PDF uygulamasını tarayıcıya çevirmek en kolay yoldur.
5. PDF içindeki bağlantılara ve "belgeyi ayrı bir dosyada aç / ek dosya" uyarılarına tıklamayın; şüpheli bir CV'yi silip geliştiriciye bildirin.

## 4. Bilinen sınırlar (PR notlarıyla aynı)
- CV'ler yalnızca güncel bir tarayıcının PDF görüntüleyicisiyle açılmalı (Adobe'de JavaScript kapalı), açan bilgisayarda antivirüs açık ve güncel olmalı; bkz. §3.1.
- Rol yok: **tüm CMS kullanıcıları tüm CV'leri görebilir** (admin onaylı karar, 5 Ekim 2026).
- Saklama 2 yıl; silme **her zaman elle**; otomatik silme yok. Admin listede süresi dolanlar uyarı olarak görünür (admin onaylı karar).
- Açık konu: yedek stratejisi (§2.3).
- Proxy sorusu kapandı (5 Ekim 2026): Cloudflare yok, CMS önünde yalnızca Coolify/Traefik var. İleride Cloudflare vb. bir katman eklenirse IP sınırı yanlış IP'ye uygulanır; eklemeden önce geliştiriciye bildirin. Sunucu Türkiye'de (Keyubu VDS).
- Erişim logları container loglarındadır; redeploy/rotasyonda kaybolabilir.
- Dakikalık burst sayacı bellektedir, redeploy'da sıfırlanır; günlük sınırlar (IP 15, e-posta 1) veritabanındadır.
- Tarama: PDF doğrulaması + aktif içerik (JS vb.) kontrolü; ClamAV yok. Kontrol hata verirse başvuru reddedilir.
- Tarama sınırları: nesne sayısı > 20.000 veya iç içe derinlik > 32 reddedilir; JBIG2/JPX (taranmış/fotoğraf tabanlı PDF) da reddedilir (13 Ekim 2026 kararı; kullanıcıya "yeniden PDF olarak kaydedin" mesajı gider). > 3.000 nesne reddedilmez, yalnızca `[cv] basvuru=<id> uyari=…` olarak loglanır. Eşikler tahminidir; log toplandıkça gözden geçirilir (`src/lib/cv/limits.ts`).
- Bayrak açılmadan önce JBIG2/JPX yanlış pozitif testi dijital araçlar için yapıldı (Canva, Google Docs, Mac yazdır: üçü de temiz, kabul edildi; 13 Ekim 2026). Taranmış CV reddi bilinçli karardır.
- E-posta doğrulaması yok.
- Bot koruması: gizli alan (honeypot, anlamsız adlı) ve form açık kalma süresi (< 3 sn). Süre istemcide `performance.now()` farkıyla ölçülür (cihaz saatinden bağımsız). Bu iki kontrole takılan istek sessizce yok sayılır ve kullanıcıya başarı görünür; container logunda tek satır `[cv] başvuru yok sayıldı sebep=honeypot|fill_too_fast` düşer (kişisel veri yok).
- IP adresi ham saklanmaz; `CV_IP_HASH_SECRET` ile HMAC-SHA256 özeti tutulur.
- Lint: ESLint config bu PR'dan önce de bozuktu; bu PR'da dokunulmadı.
- **Migration sırası (uyarı, 18 Ekim 2026):** CV havuzu gerçek merge'inde migration sırası kontrol edilmeli; CV migration'ları (`20260930_092130_…`, `20261005_163346_kariyer_cv_havuzu`) main'deki `20261013_144250_add_event_format_and_modality`'ten eski tarihli. `src/migrations/index.ts` ve `importMap.js` merge çakışması da çıkar (ikisi de iki tarafı tutarak çözülür; `index.ts`'te üç migration tarih sırasıyla).
  - Çalıştırma sırası tek başına engel değil: `payload migrate` migration'ları tarihe göre değil ada göre "çalıştı mı" diye kontrol eder (`payload/dist/database/migrations/migrate.js`); `20261013` uygulanmış bir ortamda eski tarihli CV migration'ları da çalışır. Yine de staging/yerel kopyada `migrate:status` ile doğrulanmalı.
  - **Asıl risk: snapshot ayrışması (18 Ekim 2026'da doğrulandı).** `migrate:create` önceki şemayı `src/migrations/` içindeki adı en büyük `.json` dosyasından okur (`@payloadcms/drizzle/dist/utilities/buildCreateMigration.js`). Merge sonrası en büyük snapshot main'in `20261013_144250_add_event_format_and_modality.json` dosyası olur ve onda CV tabloları (`job_applications`) ve proje alanları (`contributing_url` vb.) yoktur; CV snapshot'ında da event format/modality alanları yoktur. Bu yüzden merge sonrası ilk `migrate:create`, CV tablolarını ve proje alanlarını **yeniden oluşturmaya** çalışır.
  - Yapılacak: merge'den hemen sonra (başka şema değişikliği eklemeden) bir uzlaştırma migration'ı üretin (`npm run payload migrate:create`); oluşan `.ts` dosyasının diff'ini elle kontrol edin. Mevcut tabloları/sütunları yeniden oluşturan satırlar varsa `up`/`down` boşaltılıp yalnızca yeni `.json` snapshot'ı (iki tarafın birleşik şeması) bırakılmalı. Bu işlem production DB'ye karşı değil, ayrı bir yerel/test DB'ye karşı yapılır.
