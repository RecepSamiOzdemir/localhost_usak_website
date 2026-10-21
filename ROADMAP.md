# 🚀 Localhost Uşak — Geliştirme Yol Haritası ve Görev Rehberi (Roadmap)

> **Hedef Kitle:** Bu rehber, projeye yeni dahil olan geliştirici ekip arkadaşlarımızın sistemi uçtan uca anlaması, kod standartlarını kavraması ve görevleri öncelik sırasına göre adım adım hayata geçirmesi için hazırlanmıştır.

---

## 📌 1. Proje Mimarisi ve Teknoloji Yığını

Proje monorepo benzeri iki ana çalışma alanından oluşmaktadır:

```
localhost_usak_website/
├── localhostusak-web/          # Kullanıcı Arayüzü (Frontend)
│   ├── src/
│   │   ├── components/        # Yeniden kullanılabilir UI bileşenleri
│   │   ├── context/           # React Context (Theme, Settings, Links vb.)
│   │   ├── pages/             # Sayfa görünümleri (Home, Events, Projects vb.)
│   │   ├── services/          # API servisleri ve veri çekme katmanı
│   │   └── styles/            # Vanilla CSS Design System (Tokens, Themes)
│   └── vite.config.ts
│
├── localhostusak-cms/          # Yönetim Paneli & Backend (Payload CMS 3)
│   ├── src/
│   │   ├── app/               # Next.js App Router & API Route'ları
│   │   ├── collections/       # Payload CMS Koleksiyonları (Users, Events vb.)
│   │   ├── globals/           # Genel Ayarlar (SiteSettings, KvkkSettings vb.)
│   │   ├── migrations/        # PostgreSQL Veritabanı Migrasyonları
│   │   └── payload.config.ts  # Payload CMS ana konfigürasyonu
│   └── Dockerfile
```

### Temel Teknolojiler
- **Frontend (`localhostusak-web`):** React 18, TypeScript, Vite, Vanilla CSS (Design Tokens, Pixel/Modern/Glassmorphism temaları). *TailwindCSS kullanılmamaktadır.*
- **Backend / CMS (`localhostusak-cms`):** Next.js 15, Payload CMS 3.x, PostgreSQL (Drizzle ORM tabanlı adapter), Sharp.
- **Canlı Altyapı:** Coolify (Docker container orchestration), Traefik reverse proxy, Let's Encrypt SSL.

### Yerel Geliştirme Başlangıç Komutları
```bash
# 1. CMS'i Başlatma (Port 3000):
cd localhostusak-cms
npm install
npm run dev

# 2. Web Frontend'i Başlatma (Port 5173):
cd localhostusak-web
npm install
npm run dev
```

---

## 🎯 2. Öncelik Sırasına Göre Görev Listesi (Backlog)

```
[ÖNCELİK 1] UI Temizliği & Fazla WhatsApp Butonlarının Kaldırılması
     │
[ÖNCELİK 2] Canlıdaki Eksik Bilgiler & Sosyal Medya Entegrasyonları
     │
[ÖNCELİK 3] Etkinlikler Modülü & Geçmiş Etkinlik Statü Yönetimi
     │
[ÖNCELİK 4] "Biz Kimiz?" (Ekip / Founders / Gönüllüler) CMS & UI
     │
[ÖNCELİK 5] Topluluk Açık Kaynak Projeleri & GitHub Entegrasyonu
     │
[ÖNCELİK 6] Kariyer Sayfası & Güvenli CV Havuzu (CV Upload & Virus Scan)
     │
[ÖNCELİK 7] Topluluk Sesleri (Community Voices — Moderasyonlu Yorum Sistemi)
```

---

## 🔨 FAZ 1: UI Temizliği & Agresif Butonların Kaldırılması (Öncelik: P1)

### 📋 Problem:
Şu an sayfaların neredeyse tamamında (ve sayfa altında yüzen CTA bileşeninde) sürekli tekrarlanan *"WhatsApp Projeler Grubuna Katıl"* veya agresif yönlendirme butonları bulunmaktadır. Bu durum kullanıcı deneyimini boğmakta ve sitenin profesyonel duruşunu zedelemektedir.

### 🛠️ Yapılacaklar:
1. **Floating / Sticky CTA Temizliği:**
   - [FloatingCTA.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/components/layout/FloatingCTA.tsx) bileşeninin her sayfada altta yapışkan olarak çıkması engellenmeli veya yalnızca ana sayfada çok daha minimal/zarif bir formata çekilmeli.
2. **Sayfa İçi Buton Sadeleştirmesi:**
   - Sayfa kahraman (Hero) alanlarındaki ve içerik aralarındaki aşırı butonlar elenmeli.
   - WhatsApp katılımı, kullanıcıyı rahatsız etmeyecek şekilde yalnızca:
     - **Navbar'daki Topluluk / İletişim butonunda**
     - **Footer'daki sosyal/topluluk bağlantıları alanında**
     - Veya doğrudan etkinlik/proje detayında mantıklı olan tek bir noktada sunulmalıdır.
3. **[WhatsAppRulesModal.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/components/shared/WhatsAppRulesModal.tsx) Entegrasyonu:**
   - Kullanıcı WhatsApp'a katılmak istediğinde doğrudan grup linkine yönlendirilmeden önce topluluk kurallarını kabul ettiği zarif modal korunmalı, ancak tetikleyici sayısı sadeleştirilmeli.

---

## 🌐 FAZ 2: Canlıdaki Eksik Bilgiler ve Sosyal Medya Hesapları (Öncelik: P1)

### 📋 Amaç:
Canlı sitede (`localhostusak.tech`) yer alan eksik metinlerin, placeholder'ların, kırık veya `#` olan linklerin tamamlanması.

### 🛠️ Yapılacaklar:
1. **Merkezi Sosyal Medya ve İletişim Linkleri:**
   - `localhostusak-cms` üzerindeki `CommunityLinks` koleksiyonu ve `GeneralSettings` globali kontrol edilmeli.
   - Tüm resmi hesaplar eksiksiz doldurulmalı:
     - **Instagram:** `@localhostusak`
     - **GitHub:** `github.com/localhostusak`
     - **LinkedIn:** Localhost Uşak Topluluk Sayfası
     - **X (Twitter):** Varsa resmi hesap
     - **İletişim E-posta:** `iletisim@localhostusak.com` / `localhostusak@gmail.com`
2. **Frontend Entegrasyonu:**
   - [LinksContext.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/context/LinksContext.tsx) ve [Navbar.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/components/layout/Navbar.tsx) / [Footer.tsx](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/components/layout/Footer.tsx) bileşenlerinin bu linkleri canlı CMS'ten dinamik ve hatasız çektiği teyit edilmeli.

---

## 📅 FAZ 3: Etkinlikler Modülü & Geçmiş Etkinlik Statüsü (Öncelik: P2)

### 📋 Problem:
Tarihi geçmiş etkinlikler ile yaklaşan etkinlikler aynı statüde görünebiliyor. Kullanıcı hangisinin bittiğini, hangisine kayıt olunabileceğini net ayırt edemiyor.

### 🛠️ Yapılacaklar:
1. **CMS Model Güncellemesi (`localhostusak-cms/src/collections/Events.ts`):**
   - Etkinlik modeline durum alanı eklenmeli:
     ```ts
     {
       name: 'status',
       type: 'select',
       label: 'Etkinlik Durumu',
       defaultValue: 'upcoming',
       options: [
         { label: 'Yaklaşan Etkinlik', value: 'upcoming' },
         { label: 'Kayıtlar Devam Ediyor', value: 'open' },
         { label: 'Dolu / Kayıt Kapandı', value: 'closed' },
         { label: 'Tamamlandı (Geçmiş)', value: 'completed' },
       ],
     }
     ```
   - Ayrıca etkinlik bittikten sonra eklenebilecek `recapUrl` (etkinlik özeti/fotoğrafları/sunum linki) alanı eklenmeli.
2. **Frontend UI İyileştirmesi (`localhostusak-web/src/pages/EventsPage.tsx`):**
   - **Tarih Kontrolü:** Etkinliğin tarihi bugünden küçükse (`new Date(event.date) < new Date()`) otomatik olarak veya CMS statüsüne göre "Geçmiş Etkinlik" rozeti verilmeli.
   - **Görsel Ayrım:** Geçmiş etkinlikler daha mat/muted (grayscale veya soft opaklık) olarak listelenmeli.
   - **Filtreleme Sekmesi:** "Yaklaşan Etkinlikler" ve "Geçmiş Buluşmalar" tab'ları oluşturulmalı.

---

## 👥 FAZ 4: "Biz Kimiz?" — Ekip ve Gönüllüler Bölümü (Öncelik: P2)

### 📋 Amaç:
Topluluğun kurucularını, adminlerini ve topluluğa gönül veren, emek harcayan tüm katkı sağlayıcıları (contributors) sergilemek. Bu kişilerin CMS panelinden dinamik olarak yönetilebilmesi.

### 🛠️ Yapılacaklar:
1. **CMS Koleksiyonu Oluşturma:**
   - Dosya: `localhostusak-cms/src/collections/TeamMembers.ts`
   - Alanlar (Fields):
     - `name`: Ad Soyad (Text, zorunlu)
     - `category`: Rol Kategorisi (Select: `founder` (Kurucu), `core` (Yönetim Ekibi), `contributor` (Katkı Sağlayan / Gönüllü))
     - `title`: Unvan / Rol Tanımı (Örn: *Topluluk Lideri, Frontend Developer, Etkinlik Koordinatörü*)
     - `avatar`: Profil Görseli (Media Upload ilişkisi)
     - `bio`: Kısa Tanıtım / Manifesto (Textarea)
     - `github`: GitHub Profil URL (opsiyonel)
     - `linkedin`: LinkedIn Profil URL (opsiyonel)
     - `twitter`: X / Twitter URL (opsiyonel)
     - `order`: Sıralama Önceliği (Number)
     - `isActive`: Yayında mı? (Checkbox / Boolean)
   - `payload.config.ts` içerisine `TeamMembers` koleksiyonu dahil edilmeli.
2. **Frontend Tasarımı:**
   - Konum: `/biz-kimiz` veya `/hakkimizda` sayfası ile Ana Sayfada özet bir bölüm.
   - Tasarım: Sitenin pixel/retro-modern temasına uygun avatar çerçeveleri, unvan rozetleri, GitHub/LinkedIn butonları.
   - Kategoriye göre gruplama:
     - **👑 Kurucular (Founders)**
     - **⚡ Çekirdek Ekip (Core Team & Admins)**
     - **❤️ Gönüllüler & Katkı Sağlayanlar (Contributors)**

---

## 💻 FAZ 5: Topluluk Açık Kaynak Projeleri & GitHub Entegrasyonu (Öncelik: P3)

### 📋 Amaç:
Topluluğun ortak geliştireceği açık kaynak projelerin web sitesinde tanıtılması ve geliştiricilerin doğrudan GitHub depolarına yönlendirilmesi.

### 🛠️ Yapılacaklar:
1. **CMS `Projects` Koleksiyonunu Zenginleştirme:**
   - Mevcut [Projects.ts](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-cms/src/collections/Projects.ts) alanlarına şunlar eklenmeli:
     - `githubRepoUrl`: GitHub repo bağlantısı (örn: `https://github.com/localhostusak/proje-adi`)
     - `contributingGuideUrl`: Katkı sağlama rehberi linki
     - `projectStatus`: `idea` (Fikir Aşamasında), `development` (Geliştiriliyor), `active` (Canlıda / Bakımda)
     - `difficultyLevel`: `beginner` (Good First Issue), `intermediate`, `advanced`
     - `techStack`: Kullanılan teknolojiler (Tag listesi: React, Go, Python, Docker vb.)
2. **GitHub Tarafı Hazırlığı:**
   - GitHub organizasyonunda (`localhostusak`) başlangıç repolarının açılması.
   - Her repoda standart bir `README.md` ve `CONTRIBUTING.md` dosyası oluşturulması.
3. **Frontend Arayüzü (`localhostusak-web/src/pages/ProjectsPage.tsx`):**
   - Proje kartlarında *"GitHub'da Katkı Ver"*, *"İssue'ları Gör"* butonları.
   - Canlı GitHub yıldız/fork rozetleri veya doğrudan repo bağlantı kartları.

---

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

---

## 💬 FAZ 7: Topluluk Sesleri (Community Voices) — Moderasyonlu Yorum Sistemi (Öncelik: P4)

### 📋 Amaç:
Topluluk etkinliklerine katılan veya projelerde yer alan kişilerin deneyimlerini, yorumlarını web sitesinde paylaşabilmesi.

### 🛠️ Yapılacaklar:
1. **CMS Modeli:** `localhostusak-cms/src/collections/CommunityVoices.ts`
   - `authorName`: Yorumu Yapan (Text)
   - `authorTitle`: Unvan / Topluluk Rolü (Örn: *Yazılım Mühendisliği Öğrencisi, Katılımcı*)
   - `message`: Yorum / Düşünce (Textarea, max 300 karakter)
   - `avatarUrl`: Profil Fotoğrafı (opsiyonel)
   - `moderationStatus`: `pending` (Bekliyor), `approved` (Onaylandı), `rejected` (Reddedildi)
   - `isFeatured`: Ana sayfada öne çıkarılsın mı? (Boolean)
2. **İşleyiş ve Güvenlik:**
   - Web sitesi üzerinden yapılan yorum gönderimleri (POST isteği) **otomatik olarak `status: 'pending'`** şeklinde veritabanına kaydedilir.
   - Public GET API'si **yalnızca `status: 'approved'` olan kayıtları** döner.
   - Spam botlarını engellemek için forma görünmez Honeypot alanı ve Rate Limiting eklenir.
3. **Frontend UI:**
   - Ana sayfada veya topluluk sayfasında interaktif bir "Topluluk Duvarı" (Testimonial Grid / Slider).
   - "Sen de Düşüncelerini Paylaş" modal formu.

---

## 📐 3. Kod ve Geliştirme Standartları

1. **CSS ve Tasarım Kuralları:**
   - Harici CSS framework (Tailwind vb.) kurulmamalıdır.
   - Projenin mevcut design token'ları (`var(--accent)`, `var(--bg-primary)`, `var(--font-mono)` vb.) ve [components.css](file:///Users/ademaldemir/Development/localhost_usak_website/localhostusak-web/src/styles/components.css) kullanılmalıdır.
   - Pixel/Modern tema uyumluluğuna dikkat edilmelidir.
2. **Git İş Akışı:**
   - Geliştirmeler `new_era_w_yusuf` dalı üzerinde yapılmalıdır.
   - Commit mesajlarında standart önekler kullanılmalıdır:
     - `feat(web): ...` -> Yeni arayüz özelliği
     - `feat(cms): ...` -> Yeni CMS koleksiyonu veya endpoint
     - `fix(web): ...` -> Hata düzeltmesi
     - `style(web): ...` -> CSS / UI düzenlemesi
3. **Canlı Ortam Duyarlılığı:**
   - CMS üzerinde veritabanı şeması değiştirildiğinde migration üretilmeli veya production veritabanı ile uyum gözetilmelidir.
   - Environment variable'lar `.env.example` dosyalarına işlenmelidir.

---

*Bu belge, Localhost Uşak Topluluğu geliştirme ekibi için yaşayan bir dokümandır. Görevler tamamlandıkça işaretlenebilir.*
