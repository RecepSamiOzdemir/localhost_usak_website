<div align="center">

# 🌐 localhost[uşak]

### Uşak Teknoloji, Yazılım ve Tasarım Topluluğu Web Platformu

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Native_Sync-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://nodejs.org/api/sqlite.html)
[![Swagger](https://img.shields.io/badge/OpenAPI-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3001/api/docs)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

<br />

> **`CONNECT • CODE • CREATE • COMMUNITY`**  
> *"Deneyimli olmak şart değil; merak, öğrenme isteği ve samimiyet en önemli ortak noktamız.  
> Kahveni al, laptopunu getir, masada sana da yer var!"*

<br />

[⚡ Canlı Özellikler](#-öne-çıkan-özellikler) •
[🌓 Çift Tema Mimarisi](#-ikili-tasarım-mimarisi-dual-theme-engine) •
[🛠️ Kurulum & Çalıştırma](#-kurulum-ve-yerel-geliştirme) •
[📁 Proje Mimarisi](#-proje-dizin-yapısı) •
[🔌 API & Swagger](#-api-ve-veritabanı-mimarisi) •
[💬 Topluluk](#-topluluğa-katılın)

</div>

---

## 📌 Proje Hakkında

**localhost[uşak]**, Uşak ilindeki yazılımcılar, mühendisler, dijital tasarımcılar, remote/freelance çalışanlar, üniversite öğrencileri ve teknoloji meraklılarını bir araya getiren bağımsız yerel teknoloji topluluğunun resmi web platformudur.

Bu platform; topluluk buluşmalarını organize etmek, Uşak ve uzaktan çalışma ekosistemindeki staj/iş fırsatlarını listelemek, üyelerin açık kaynak ve yerel projelerini vitrine taşımak ve topluluk içi etkileşimi güçlendirmek amacıyla geliştirilmektedir.

---

## 🚀 Güncel Durum ve Tamamlanan Özellikler

Platform güncel olarak **Frontend (SPA)**, **Backend (REST API + SQLite)** ve **Yönetim Paneli (Admin CMS)** ile tam entegre çalışmaktadır.

### 🌟 1. Çift Tasarım Dili Motoru (Dual Theme Engine)
Platform, Uşak topluluğunun iki farklı ruhunu tek kod tabanında yaşatan interaktif bir tema motoruna sahiptir:
- **Cyber HUD Mode (Modern):** Fütüristik koyu zemin, neon turuncu/camgöbeği detaylar, cam efekti (`glassmorphism`), terminal estetiği ve modern monospace tipografi.
- **Cozy Retro Mode (Pixel Art Kafe):** 8-bit / 16-bit nostaljik arcade estetiği, pikselli fontlar (*Press Start 2P*, *Silkscreen*), retro basmalı butonlar ve samimi kafe masası sıcaklığı.
- **🕹️ "The Reality Fracture" (Glitch Easter Egg):** Kullanıcı navbar üzerindeki boyutsal çatlak/durum göstergesine 3 kez tıkladığında; ekran sarsıntısı, parazit efektleri ve yerleşik **Web Audio API** tarafından sentezlenen 8-bit sesler eşliğinde retro piksel evrenine geçiş gerçekleşir.

### 📅 2. Etkinlik Yönetimi & Geri Sayım (Events)
- **Sıradaki Buluşma Odağı:** Canlı geri sayım sayacı, etkinlik tipi rozetleri, mekan/saat bilgisi ve harita yönlendirmesi.
- **Takvim Entegrasyonu:** Google Calendar ve standart `.ics` formatında tek tıkla takvime ekleme.
- **Etkinlik Filtreleme & Arşiv:** Kategori bazlı filtreleme (Code & Coffee, Tech Talk & Workshop, Hackathon, Networking) ve geçmiş etkinlik kayıtları.

### 💼 3. Kariyer & Staj Platformu (Careers)
- Uşak yerelindeki teknoloji şirketleri ile remote çalışan ekiplerin staj ve iş ilanları.
- Rol seviyesi (Junior, Mid, Senior, Stajyer) ve çalışma modeli (Remote, Hibrit, Yerinde) filtreleri.
- Başvuru linkleri, maaş/yan haklar şeffaflığı ve şirket detayları.

### 💻 4. Topluluk Projeleri Vitrini (Showcase)
- Uşak'taki geliştiricilerin ürettiği açık kaynak veya canlı ürünlerin sergilendiği vitrin.
- Tech stack etiketleri, GitHub repo bağlantıları ve canlı demo yönlendirmeleri.

### 🛡️ 5. Dinamik Admin Yönetim Paneli (`/admin`)
- **Etkinlik Türleri (Event Types):** İkon, etiket ve tema rengi belirleyerek yeni etkinlik kategorileri tanımlama.
- **Etkinlikler:** Yeni etkinlik oluşturma, tarih, yer, kontenjan düzenleme ve silme.
- **Kariyer İlanları:** Yeni iş/staj ilanı yayınlama, etiketleme ve yönetme.
- **Projeler:** Topluluk vitrinine yeni projeler ekleme ve güncelleme.
- **WhatsApp & Topluluk Bağlantıları:** Genel topluluk, projeler, kariyer ve coworking WhatsApp grupları ile sosyal medya (Instagram, GitHub, X) linklerini kod yazmadan tek ekrandan düzenleme, test etme (`Test ↗`) ve kaydetme.
- Canlı istatistik sayaçları ve anlık veri senkronizasyonu.

### ⚡ 6. Native SQLite & REST API Backend
- **Node.js 22+ Native SQLite (`node:sqlite`):** Harici derleyicilere (`node-gyp`, Python vb.) gerek duymayan, sıfır bağımlılıklı modern ve ultra hızlı veritabanı.
- **Swagger / OpenAPI 3.0 Entegrasyonu:** `/api/docs` üzerinden canlı olarak test edilebilen kapsamlı dokümantasyon arayüzü.
- **Otomatik Schema & Seed:** İlk çalıştırmada şemayı ve başlangıç verilerini (`community_links` dahil) otomatik yükler.
- **Graceful Offline Fallback:** Backend servisi çalışmasa dahi frontend, yerleşik JSON verileri ve `localStorage` ile kesintisiz çalışmayı sürdürür.

### 💬 7. Sosyal & Topluluk Entegrasyonları (Merkezi Link Mimarisi)
- **Merkezi Konfigürasyon (`src/constants/links.ts`):** Tüm WhatsApp çalışma grupları ve sosyal bağlantılar tek bir dosyadan veya Admin panelinden yönetilir.
- **Canlı Senkronizasyon (`LinksContext`):** Linklerde yapılan değişiklikler sayfayı yenilemeye gerek kalmadan tüm sitede (Hero, Altbilgi, Floating CTA, Alt sayfalar) anında yansır.
- Canlı WhatsApp Topluluk Grubu doğrudan katılım köprüsü.
- Instagram ve GitHub topluluk sayfaları bağlantıları.
- Sayfa altı ve sağ alt köşede her zaman erişilebilir dinamik CTA barı.

---

## 🛠️ Teknoloji Yığını

### Frontend
| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| **React** | `^19.0.0` | Modern SPA mimarisi ve bileşen yapısı |
| **TypeScript** | `~5.7.2` | Tip güvenliği ve ölçeklenebilir kod tabanı |
| **Vite** | `^6.2.0` | Hızlı HMR, geliştirme sunucusu ve optimize derleme |
| **React Router** | `^7.3.0` | SPA istemci tarafı sayfa yönlendirmeleri |
| **Vanilla CSS / Custom Design System** | - | CSS Değişkenleri, Dual Theme motoru, Camgöbeği/Neon efektler, Responsive Grid |
| **Web Audio API** | Native | Retro tema geçişinde prosedürel sentezlenen 8-bit ses efektleri |

### Backend
| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| **Node.js** | `>= 22.0.0` | Modern ES Module JavaScript çalışma ortamı |
| **Express** | `^4.21.2` | RESTful API servisi |
| **node:sqlite (DatabaseSync)** | Native | Yerel, sıfır konfigürasyonlu SQLite veritabanı motoru |
| **Bcrypt.js** | `^3.0.3` | Güvenli tek yönlü parola hashleme (SaltRounds=10) |
| **JSON Web Token (JWT)** | `^9.0.2` | Stateless, imzalı 24 saatlik yönetici oturum tokenları |
| **Helmet** | `^8.1.0` | HTTP güvenlik başlıkları (X-Frame-Options, HSTS, No-Sniff) |
| **Express Rate Limit** | `^8.2.1` | Brute-force ve DoS kalkanı (Auth & API hız sınırlayıcı) |
| **Swagger UI Express** | `^5.0.1` | İnteraktif OpenAPI 3.0 dokümantasyon arayüzü (`/api/docs`) |
| **CORS** | `^2.8.5` | Origin Whitelist tabanlı sıkı erişim denetimi |

---

## 📁 Proje Dizin Yapısı

```text
localhost_usak_website/
├── DESIGN_SYSTEM.md                    # Temel tasarım ilkeleri dokümantasyonu
├── DESIGN_SYSTEM_MODERN.md             # Modern Cyber-HUD tema kuralları
├── DESIGN_SYSTEM_PIXEL.md              # Cozy Retro Pixel tema kuralları
├── WEBSITE_STRUCTURE_AND_BRAINSTORMING.md # Sayfa mimarisi ve beyin fırtınası notları
├── References/                         # Topluluk afişleri, logolar ve grafik referansları
└── localhostusak-web/                  # Ana Web Uygulaması (Client & Server)
    ├── package.json                    # Frontend paket konfigürasyonu
    ├── vite.config.ts                  # Vite + API Proxy yapılandırması
    ├── index.html                      # Giriş HTML şablonu ve font bağlantıları
    ├── src/
    │   ├── main.tsx                    # React DOM giriş noktası
    │   ├── App.tsx                     # Sayfa yönlendirmeleri ve Layout
    │   ├── utils/
    │   │   └── auth.ts                 # JWT Token yönetimi, Bearer header ve logout yardımcıları
    │   ├── constants/
    │   │   └── links.ts                # Merkezi WhatsApp ve sosyal link sabitleri
    │   ├── context/
    │   │   ├── ThemeContext.tsx        # Tema motoru, ses sentezleyici ve Glitch mekanizması
    │   │   └── LinksContext.tsx        # Link durumu ve anlık canlı güncelleme motoru
    │   ├── components/
    │   │   ├── layout/                 # Navbar, Footer, FloatingCTA, PageHero
    │   │   ├── home/                   # HeroSection, EventSpotlight, Bento, FlowSteps, Stats
    │   │   ├── events/                 # Etkinlik listesi ve takvim kartları
    │   │   ├── careers/                # İlan kartları ve filtreler
    │   │   ├── projects/               # Proje vitrin kartları
    │   │   └── shared/                 # Ortak UI bileşenleri (Button, Badge vb.)
    │   ├── pages/
    │   │   ├── HomePage.tsx            # Ana Karşılama Sayfası
    │   │   ├── EventsPage.tsx          # Etkinlikler Sayfası (/etkinlikler)
    │   │   ├── CareersPage.tsx         # Kariyer & Staj Sayfası (/kariyer)
    │   │   ├── ProjectsPage.tsx        # Projeler Sayfası (/projeler)
    │   │   └── AdminPage.tsx           # Yönetim Paneli (JWT Login Kartı + CMS Yönetimi)
    │   ├── data/                       # Çevrimdışı ve başlangıç fallback JSON verileri
    │   ├── styles/                     # CSS Modülleri (Modern, Pixel, Reset, Animasyonlar)
    │   └── types/                      # TypeScript tip tanımları
    └── server/
        ├── package.json                # Backend sunucu bağımlılıkları
        ├── index.js                    # Express API sunucusu (Güvenlik katmanları)
        ├── swagger.json                # OpenAPI 3.0 API spesifikasyonu
        ├── .env.example                # Ortam değişkenleri şablonu
        ├── .env                        # Yerel ortam değişkenleri (Gizli)
        ├── db/
        │   ├── database.js             # node:sqlite bağlantı & otomatik migrasyon motoru
        │   ├── schema.sql              # Tablo şemaları (admins, audit_logs dahil DDL)
        │   └── seed.sql                # Başlangıç test verileri (bcrypt hash)
        ├── middleware/
        │   ├── authMiddleware.js       # JWT requireAuth yetkilendirme kalkanı
        │   ├── rateLimiter.js          # Auth (10/15dk) & API (300/15dk) rate limiter
        │   ├── validators.js           # XSS tag temizleme & veri doğrulama
        │   └── auditLogger.js          # Admin işlemlerini SQLite'a kaydeden denetim günlüğü
        ├── scripts/
        │   ├── hashPassword.js         # Parola hashleme yardımcı scripti
        │   └── setAdmin.js             # Admin kullanıcı/şifre güncelleme CLI aracı
        └── routes/
            ├── auth.js                 # /api/auth/login, verify & change-password
            ├── events.js               # /api/events & korumalı admin uçları
            ├── eventTypes.js           # /api/event-types & korumalı admin uçları
            ├── careers.js              # /api/careers & korumalı admin uçları
            ├── projects.js             # /api/projects & like cooldown kalkanı
            └── links.js                # /api/links ve korumalı /api/admin/links uçları
```

---

## 🛠️ Kurulum ve Yerel Geliştirme

### Gereksinimler
- **Node.js:** `v22.0.0` veya üzeri önerilir (*native SQLite desteği için*).
- **npm:** `v10.0.0` veya üzeri.

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/RecepSamiOzdemir/localhost_usak_website.git
cd "localhost_usak_website/localhostusak-web"
```

### 2. Bağımlılıkları Yükleyin
Hem frontend hem backend bağımlılıklarını kurun:

```bash
# Frontend paketlerini yükleyin
npm install

# Backend paketlerini yükleyin
npm --prefix server install
```

### 3. Çevre Değişkenlerini (.env) Yapılandırın
Backend dizininde `.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp server/.env.example server/.env
```

> **Varsayılan Admin Giriş Bilgileri:**  
> Kullanıcı Adı: `admin`  
> Şifre: `admin123`  
> *(Şifrenizi dilediğiniz an `node server/scripts/setAdmin.js admin YeniSifreniz` komutu ile değiştirebilirsiniz).*

### 4. Geliştirme Sunucularını Başlatın

İki ayrı terminal penceresinde frontend ve backend servislerini çalıştırabilirsiniz:

#### Terminal 1 — Backend API & Veritabanı
```bash
npm run server
```
> Sunucu `http://localhost:3001` portunda ayağa kalkar.  
> 📖 Canlı Swagger dokümantasyonu: `http://localhost:3001/api/docs`

#### Terminal 2 — Frontend Geliştirme Sunucusu (Vite)
```bash
npm run dev
```
> Web sitesi `http://localhost:5173` adresinde açılır.  
> Vite, `/api/*` isteklerini otomatik olarak arka plandaki `http://localhost:3001` servisine yönlendirir.

---

## 🛡️ Siber Güvenlik Mimarisi

Platform, kurumsal düzeyde 13 temel güvenlik açığına karşı tam koruma altına alınmıştır:

1. **JWT Yetkilendirme & Giriş Kartı:** `/admin` rotası token kontrolüyle kilitlidir. 24 saat geçerli JWT token tarayıcıda yönetilir.
2. **Backend Route Kilidi:** Tüm `/api/admin/*` ve veri değiştiren endpointler `requireAuth` middleware'i ile korunmaktadır.
3. **Bcrypt Parola Güvenliği:** Parolalar veritabanında asla düz metin saklanmaz, `bcrypt` (10 salt round) ile hashlenir.
4. **Sıkı CORS Whitelist:** Sadece izin verilen origin'lerden (`CORS_ORIGIN`) gelen isteklere izin verilir; yetkisiz erişimler `403 Forbidden` ile reddedilir.
5. **Rate Limiting (Brute-Force Kalkanı):** `/api/auth/*` için 15 dakikada en fazla 10 istek; genel `/api/*` için 15 dakikada 300 istek sınırı.
6. **XSS Sanitization & Input Validation:** İstemciden gelen zararlı `<script>` ve HTML etiketleri otomatik temizlenir.
7. **DoS & Payload Flood Koruması:** İstek gövdesi maksimum 20KB ile sınırlandırılmıştır (`413 Payload Too Large`).
8. **Güvenlik HTTP Başlıkları (Helmet):** Clickjacking (`X-Frame-Options`), MIME sniffing (`nosniff`) ve HSTS başlıkları devrededir.
9. **Beğeni Spam Koruması:** Proje beğenme endpointinde IP + Proje ID bazlı 1 saatlik cooldown uygulanır (`429 Too Many Requests`).
10. **Denetim Günlüğü (Audit Logging):** Tüm yönetici ekleme, düzenleme ve silme hareketleri `audit_logs` tablosuna kaydedilir.
11. **Hata Bilgi Sızıntısı Engeli:** Sunucu içi dosya yolları ve SQL hataları gizlenerek istemciye jenerik güvenli mesajlar iletilir.
12. **Swagger Prodüksiyon Gizleme:** Canlı ortamda (`NODE_ENV=production`) API dökümantasyonu otomatik olarak `404` döndürerek gizlenir.

---

## 🔌 API ve Veritabanı Mimarisi

Backend servisi REST standartlarına uygun CRUD ve Kimlik Doğrulama uçları sunmaktadır:

| Yöntem | Uç Nokta | Yetki | Açıklama |
|---|---|---|---|
| `GET` | `/api/health` | Herkese Açık | Sunucu sağlık durumu kontrolü |
| `POST` | `/api/auth/login` | Rate Limited | Kullanıcı adı & şifre ile JWT token alma |
| `GET` | `/api/auth/verify` | 🔒 Bearer Token | Mevcut JWT token geçerlilik kontrolü |
| `POST` | `/api/auth/change-password`| 🔒 Bearer Token | Admin parolasını güncelleme |
| `GET` | `/api/events` | Herkese Açık | Tüm etkinlikleri listeler |
| `POST` | `/api/admin/events` | 🔒 Bearer Token | Yeni etkinlik oluşturur (XSS Filtreli) |
| `DELETE` | `/api/admin/events/:id` | 🔒 Bearer Token | Etkinliği siler (Audit loglanır) |
| `GET` | `/api/event-types` | Herkese Açık | Etkinlik türlerini listeler |
| `POST` | `/api/admin/event-types` | 🔒 Bearer Token | Yeni etkinlik türü ekler |
| `GET` | `/api/careers` | Herkese Açık | İş ve staj ilanlarını listeler |
| `POST` | `/api/admin/careers` | 🔒 Bearer Token | Yeni ilan oluşturur |
| `DELETE` | `/api/admin/careers/:id` | 🔒 Bearer Token | İlanı yayından kaldırır |
| `GET` | `/api/projects` | Herkese Açık | Topluluk projelerini listeler |
| `PATCH`| `/api/projects/:id/like` | Cooldown Korumalı | Projeyi beğenir (1 saatte 1 beğeni/IP) |
| `POST` | `/api/admin/projects` | 🔒 Bearer Token | Yeni proje ekler |
| `DELETE` | `/api/admin/projects/:id` | 🔒 Bearer Token | Projeyi siler |
| `GET` | `/api/links` | Herkese Açık | Topluluk ve WhatsApp grup bağlantılarını listeler |
| `PUT` | `/api/admin/links` | 🔒 Bearer Token | WhatsApp ve topluluk bağlantılarını günceller |
| `GET` | `/api/docs` | Dev/Ops | İnteraktif Swagger UI arayüzü |

---

## 🗺️ Yol Haritası (Roadmap)

- [x] Temel sayfa mimarisinin kurulması (Ana Sayfa, Etkinlikler, Kariyer, Projeler).
- [x] Çift tema motoru (Cyber-HUD & Cozy Pixel Kafe) ve ses efektli Glitch geçişi.
- [x] Node.js 22 Native SQLite veritabanı entegrasyonu.
- [x] İnteraktif Swagger UI API dokümantasyonu.
- [x] Tam işlevsel Admin Yönetim Paneli (`/admin`).
- [x] Offline fallback JSON veri katmanı.
- [x] Merkezi WhatsApp ve Topluluk Linkleri Yönetimi (Admin Paneli & SQLite entegrasyonu).
- [ ] Topluluk Üye Profilleri & "Buluşmadayım" QR check-in sistemi.
- [ ] E-posta / WhatsApp etkinlik hatırlatma bildirimleri.
- [ ] Blog / Yazılar bölümü (Topluluk üyelerinin teknik makaleleri için).

---

## 💬 Topluluğa Katılın

Uşak'ta teknoloji üretiyor, öğreniyor ya da sadece samimi bir ortamda kahve eşliğinde sohbet etmek istiyorsanız aramıza davetlisiniz:

- 💬 **WhatsApp Topluluğu:** [Katılmak İçin Tıklayın](https://chat.whatsapp.com/G4lE8B7s1h696jM7q5hUfR)
- 📸 **Instagram:** [@localhostusak](https://instagram.com/localhostusak)
- 💻 **GitHub:** [localhost_usak_website](https://github.com/RecepSamiOzdemir/localhost_usak_website)

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında açık kaynak olarak geliştirilmektedir. Topluluğa katkıda bulunmaktan çekinmeyin!
