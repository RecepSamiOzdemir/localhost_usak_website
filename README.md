<div align="center">

# 🌐 localhost[uşak]

### Uşak Teknoloji, Yazılım ve Tasarım Topluluğu Web Platformu

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.89-000000?style=for-the-badge&logo=payloadcms&logoColor=white)](https://payloadcms.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

<br />

> **`CONNECT • CODE • CREATE • COMMUNITY`**  
> *"Deneyimli olmak şart değil; merak, öğrenme isteği ve samimiyet en önemli ortak noktamız.  
> Kahveni al, laptopunu getir, masada sana da yer var!"*

<br />

[⚡ Özellikler](#-öne-çıkan-özellikler) •
[🏗️ Mimari](#%EF%B8%8F-mimari-genel-bakış) •
[🛠️ Kurulum](#%EF%B8%8F-kurulum-ve-yerel-geliştirme) •
[📁 Proje Yapısı](#-proje-dizin-yapısı) •
[🚀 Canlıya Alma](#-canlıya-alma-vps-deploy) •
[💬 Topluluk](#-topluluğa-katılın)

</div>

---

## 📌 Proje Hakkında

**localhost[uşak]**, Uşak ilindeki yazılımcılar, mühendisler, dijital tasarımcılar, remote/freelance çalışanlar, üniversite öğrencileri ve teknoloji meraklılarını bir araya getiren bağımsız yerel teknoloji topluluğunun resmi web platformudur.

Platform; topluluk buluşmalarını organize etmek, Uşak ve uzaktan çalışma ekosistemindeki staj/iş fırsatlarını listelemek, üyelerin açık kaynak ve yerel projelerini vitrine taşımak ve topluluk içi etkileşimi güçlendirmek amacıyla geliştirilmiştir.

---

## 🏗️ Mimari Genel Bakış

Proje, **monorepo** yapıda üç ana katmandan oluşur:

```
┌──────────────────────────────────────────────────────────────┐
│                    localhostusak.com                          │
│                   ┌──────────┐                               │
│    Kullanıcı  ──▶ │  Nginx   │ (Reverse Proxy + SSL + Gzip) │
│                   └────┬─────┘                               │
│              ┌─────────┴──────────┐                          │
│              ▼                    ▼                           │
│   ┌──────────────────┐  ┌─────────────────────┐             │
│   │  localhostusak-  │  │  localhostusak-cms   │             │
│   │      web         │  │  (Payload CMS v3)    │             │
│   │  React 19 + Vite │  │  Next.js 16 + API    │             │
│   │  Statik SPA      │  │  Port 3000 (PM2)     │             │
│   │  /dist → Nginx   │  │         │            │             │
│   └──────────────────┘  │         ▼            │             │
│                         │  ┌──────────────┐    │             │
│                         │  │ PostgreSQL   │    │             │
│                         │  │   16         │    │             │
│                         │  └──────────────┘    │             │
│                         └─────────────────────┘             │
└──────────────────────────────────────────────────────────────┘
```

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Frontend** | React 19 + Vite 6 + TypeScript | Kullanıcıya sunulan SPA. Build sonrası statik dosyalar Nginx üzerinden servis edilir |
| **CMS & API** | Payload CMS v3 + Next.js 16 | Headless CMS admin paneli (`/admin`) ve REST/GraphQL API. PM2 ile ayakta |
| **Veritabanı** | PostgreSQL 16 | Tüm içerik verisi, kullanıcılar ve medya metadata |
| **Altyapı** | Nginx + PM2 + Certbot + UFW | Reverse proxy, SSL, süreç yönetimi, güvenlik duvarı |

---

## ⚡ Öne Çıkan Özellikler

### 🌟 Çift Tasarım Dili Motoru (Dual Theme Engine)
Platform, Uşak topluluğunun iki farklı ruhunu tek kod tabanında yaşatan interaktif bir tema motoruna sahiptir:
- **Cyber HUD Mode (Modern):** Fütüristik koyu zemin, neon turuncu/camgöbeği detaylar, cam efekti (`glassmorphism`), terminal estetiği ve monospace tipografi.
- **Cozy Retro Mode (Pixel Art Kafe):** 8-bit / 16-bit nostaljik arcade estetiği, pikselli fontlar (*Press Start 2P*, *Silkscreen*), retro basmalı butonlar ve samimi kafe masası sıcaklığı.
- **🕹️ "The Reality Fracture" (Glitch Easter Egg):** Kullanıcı navbar üzerindeki boyutsal çatlak göstergesine 3 kez tıkladığında; ekran sarsıntısı, parazit efektleri ve **Web Audio API** ile sentezlenen 8-bit sesler eşliğinde retro piksel evrenine geçiş gerçekleşir.

### 📅 Etkinlik Yönetimi & Geri Sayım
- Canlı geri sayım sayacı, etkinlik tipi rozetleri, mekan/saat bilgisi ve harita yönlendirmesi.
- Google Calendar ve `.ics` formatında tek tıkla takvime ekleme.
- Kategori bazlı filtreleme (Code & Coffee, Tech Talk & Workshop, Hackathon, Networking) ve arşiv.

### 💼 Kariyer & Staj Platformu
- Uşak yerelindeki teknoloji şirketleri ile remote ekiplerin staj ve iş ilanları.
- Rol seviyesi, çalışma modeli ve departman filtreleri.
- Başvuru linkleri, maaş/yan haklar şeffaflığı ve şirket detayları.

### 💻 Topluluk Projeleri Vitrini
- Uşak'taki geliştiricilerin ürettiği açık kaynak veya canlı ürünlerin sergilendiği vitrin.
- Tech stack etiketleri, GitHub repo bağlantıları, canlı demo yönlendirmeleri ve beğeni sistemi.

### 🤝 Sponsorlar
- Topluluğu destekleyen şirket ve kuruluşların logo ve bağlantılarıyla sergilendiği sponsor alanı.

### 📱 WhatsApp Topluluk Entegrasyonu
- WhatsApp grup bağlantıları topluluk kurallarını gösteren onay modalı üzerinden sunulur.
- Tüm grup linkleri CMS'den tek ekranda yönetilir; değişiklikler sitede anında yansır.

### 🛡️ Payload CMS v3 Yönetim Paneli (`/admin`)
Tüm içerik yönetimi kod yazmadan Payload CMS üzerinden yapılır:

| CMS Koleksiyonları | CMS Global Ayarları |
|---|---|
| **Events** — Etkinlik CRUD | **SiteSettings** — Başlık, açıklama, SEO, sosyal linkler |
| **EventTypes** — Etkinlik kategorileri | **GeneralSettings** — WhatsApp grupları ve genel ayarlar |
| **Careers** — İş/staj ilanları | **EventsPageSettings** — Etkinlikler sayfası başlık/açıklama |
| **Projects** — Topluluk projeleri | **CareersPageSettings** — Kariyer sayfası ayarları |
| **Sponsors** — Sponsor yönetimi | **ProjectsPageSettings** — Projeler sayfası ayarları |
| **CommunityLinks** — Topluluk bağlantıları | |
| **Media** — Görsel/dosya yükleme | |
| **Users** — Admin kullanıcıları | |

---

## 🛠️ Teknoloji Yığını

### Frontend (`localhostusak-web`)
| Teknoloji | Sürüm | Kullanım |
|---|---|---|
| **React** | `^19.0.0` | SPA bileşen mimarisi |
| **TypeScript** | `~5.7.2` | Tip güvenliği |
| **Vite** | `^6.2.0` | HMR, dev server, optimized build |
| **React Router** | `^7.3.0` | İstemci tarafı yönlendirme |
| **Vanilla CSS** | — | Dual Theme motoru, CSS değişkenleri, glassmorphism, responsive grid |
| **Web Audio API** | Native | 8-bit prosedürel ses sentezi |

### CMS & API Backend (`localhostusak-cms`)
| Teknoloji | Sürüm | Kullanım |
|---|---|---|
| **Payload CMS** | `3.89.0` | Headless CMS, REST/GraphQL API, admin paneli |
| **Next.js** | `16.3.3` | Payload'ın çalışma ortamı (SSR + API routes) |
| **PostgreSQL** | `16` | İlişkisel veritabanı |
| **Sharp** | `0.35.4` | Görsel işleme ve optimizasyon |
| **Lexical Editor** | — | Zengin metin editörü |

### Altyapı & DevOps (`deploy/`)
| Teknoloji | Kullanım |
|---|---|
| **Nginx** | Reverse proxy, SSL termination, Gzip, rate limiting, SPA fallback |
| **PM2** | Node.js süreç yöneticisi (auto-restart, log yönetimi) |
| **Certbot** | Ücretsiz Let's Encrypt SSL sertifikası |
| **UFW** | Güvenlik duvarı |
| **pg_dump Cron** | Otomatik günlük PostgreSQL yedekleme |

### Test Altyapısı
| Teknoloji | Kullanım |
|---|---|
| **Vitest** | Birim testler |
| **Playwright** | Uçtan uca (E2E) testler |

---

## 📁 Proje Dizin Yapısı

```text
localhost_usak_website/
├── package.json                           # Monorepo root scripts (dev, cms, build)
├── README.md
├── DESIGN_SYSTEM.md                       # Temel tasarım ilkeleri
├── DESIGN_SYSTEM_MODERN.md                # Cyber-HUD tema kuralları
├── DESIGN_SYSTEM_PIXEL.md                 # Cozy Retro Pixel tema kuralları
├── WEBSITE_STRUCTURE_AND_BRAINSTORMING.md # Sayfa mimarisi ve beyin fırtınası
├── References/                            # Topluluk afişleri, logolar ve grafikler
│
├── localhostusak-web/                     # 🎨 Frontend SPA (React 19 + Vite)
│   ├── package.json
│   ├── vite.config.ts                     # Dev proxy (/api, /media → :3000)
│   ├── index.html
│   └── src/
│       ├── main.tsx                       # React DOM giriş noktası
│       ├── App.tsx                        # Sayfa yönlendirmeleri ve Layout
│       ├── components/
│       │   ├── home/                      # HeroSection, EventSpotlight, Bento, Stats
│       │   ├── events/                    # Etkinlik kartları ve filtreleme
│       │   ├── careers/                   # Kariyer kartları ve filtreler
│       │   ├── projects/                  # Proje vitrin kartları
│       │   ├── layout/                    # Navbar, Footer, FloatingCTA, PageHero
│       │   └── shared/                    # Ortak UI bileşenleri
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── EventsPage.tsx             # /etkinlikler
│       │   ├── CareersPage.tsx            # /kariyer
│       │   ├── ProjectsPage.tsx           # /projeler
│       │   ├── AdminPage.tsx              # CMS'e yönlendirme
│       │   └── NotFoundPage.tsx           # 404 sayfası
│       ├── context/
│       │   ├── ThemeContext.tsx            # Dual tema motoru ve Glitch mekanizması
│       │   ├── SiteSettingsContext.tsx     # CMS site ayarları (SEO, sponsorlar)
│       │   ├── GeneralSettingsContext.tsx  # CMS genel ayarları
│       │   ├── LinksContext.tsx            # Topluluk linkleri state
│       │   └── WhatsAppModalContext.tsx    # WhatsApp kurallar modalı
│       ├── services/
│       │   └── api.ts                     # Payload CMS REST API entegrasyonu
│       ├── hooks/                         # useCountdown, usePageMeta, useTheme
│       ├── styles/                        # CSS: tokens, themes, layout, animations
│       ├── data/                          # Offline fallback JSON verileri
│       ├── types/                         # TypeScript tip tanımları
│       └── utils/                         # Yardımcı fonksiyonlar
│
├── localhostusak-cms/                     # ⚙️ Headless CMS (Payload v3 + Next.js)
│   ├── package.json
│   ├── Dockerfile                         # Container build
│   ├── docker-compose.yml                 # CMS + PostgreSQL compose
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── payload.config.ts              # Ana Payload konfigürasyonu
│       ├── seed.ts                        # Başlangıç verileri (tsx ile çalıştırılır)
│       ├── payload-types.ts               # Otomatik üretilen TypeScript tipleri
│       ├── collections/
│       │   ├── Users.ts                   # Admin kullanıcıları
│       │   ├── Media.ts                   # Görsel/dosya yükleme
│       │   ├── Events.ts                  # Etkinlikler
│       │   ├── EventTypes.ts              # Etkinlik türleri
│       │   ├── Careers.ts                 # İş/staj ilanları
│       │   ├── Projects.ts                # Topluluk projeleri
│       │   ├── Sponsors.ts                # Sponsorlar
│       │   └── CommunityLinks.ts          # Topluluk bağlantıları
│       ├── globals/
│       │   ├── SiteSettings.ts            # Site geneli: başlık, SEO, sosyal
│       │   ├── GeneralSettings.ts         # WhatsApp grupları, genel ayarlar
│       │   ├── EventsPageSettings.ts      # Etkinlikler sayfası ayarları
│       │   ├── CareersPageSettings.ts     # Kariyer sayfası ayarları
│       │   └── ProjectsPageSettings.ts    # Projeler sayfası ayarları
│       └── app/                           # Next.js App Router (CMS UI)
│
└── deploy/                                # 🚀 Production Altyapı
    ├── DEPLOYMENT_GUIDE.md                # Adım adım VPS dağıtım rehberi
    ├── ecosystem.config.cjs               # PM2 süreç konfigürasyonu
    ├── backup-db.sh                       # Otomatik PostgreSQL yedekleme scripti
    └── nginx/
        └── localhostusak.conf             # Nginx reverse proxy konfigürasyonu
```

---

## 🛠️ Kurulum ve Yerel Geliştirme

### Gereksinimler
- **Node.js:** `v20.9.0` veya üzeri (v22 LTS önerilir)
- **PostgreSQL:** `16` (yerel kurulum veya Docker)
- **npm:** `v10.0.0` veya üzeri

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/RecepSamiOzdemir/localhost_usak_website.git
cd localhost_usak_website
```

### 2. PostgreSQL Veritabanını Hazırlayın
```bash
# PostgreSQL shell'ine bağlanın
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE localhostusak;
\q
```

### 3. CMS'i Kurun ve Başlatın

```bash
cd localhostusak-cms

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
# .env içinde DATABASE_URL ve PAYLOAD_SECRET ayarlayın

# Başlangıç verilerini yükleyin (opsiyonel)
npm run seed

# CMS geliştirme sunucusunu başlatın
npm run dev
```
> CMS Admin Paneli: `http://localhost:3000/admin`  
> İlk girişte admin kullanıcınızı oluşturmanız istenecektir.

### 4. Frontend'i Kurun ve Başlatın

```bash
cd localhostusak-web

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
> Web Sitesi: `http://localhost:5173`  
> Vite, `/api/*` ve `/media/*` isteklerini otomatik olarak `http://localhost:3000` adresine yönlendirir.

### 🚀 Root Kısayolları
Monorepo kökünden her iki servisi ayrı terminallerde başlatabilirsiniz:
```bash
# Terminal 1 — CMS & API
npm run cms

# Terminal 2 — Frontend
npm run dev
```

---

## 🚀 Canlıya Alma (VPS Deploy)

Proje, **Ubuntu VPS** üzerinde production'a hazır bir altyapıyla birlikte gelir. Detaylı adımlar için [`deploy/DEPLOYMENT_GUIDE.md`](deploy/DEPLOYMENT_GUIDE.md) dosyasına bakın.

### Özet Mimari

| Bileşen | Servis | Port/Yol |
|---|---|---|
| **Frontend SPA** | Nginx statik servis | `/dist → /` |
| **CMS & API** | PM2 → Node.js | `:3000` |
| **Admin Paneli** | Nginx proxy → PM2 | `/admin` |
| **REST API** | Nginx proxy → PM2 (rate limited) | `/api/*` |
| **Medya** | Nginx proxy → PM2 (cache 30d) | `/media/*` |
| **SSL** | Certbot (Let's Encrypt) | HTTPS otomatik |
| **Veritabanı** | PostgreSQL 16 | Yerel |
| **Yedekleme** | Cron + pg_dump | Her gece 03:00 |

### Deploy Dosyaları

| Dosya | Açıklama |
|---|---|
| [`ecosystem.config.cjs`](deploy/ecosystem.config.cjs) | PM2 süreç konfigürasyonu (auto-restart, 2GB RAM limiti, log yolları) |
| [`localhostusak.conf`](deploy/nginx/localhostusak.conf) | Nginx: reverse proxy, güvenlik başlıkları, Gzip, rate limiting, SPA fallback |
| [`backup-db.sh`](deploy/backup-db.sh) | Günlük PostgreSQL yedekleme scripti (7 günden eski yedekleri temizler) |

---

## 🛡️ Güvenlik Mimarisi

| Katman | Koruma |
|---|---|
| **Nginx** | Rate limiting (20r/s + burst 30), Gzip, güvenlik başlıkları (HSTS, X-Frame-Options, nosniff, XSS Protection) |
| **Payload CMS** | Yerleşik kimlik doğrulama, rol bazlı erişim kontrolü, CSRF koruması |
| **CORS** | Origin whitelist (sadece `localhostusak.com` ve geliştirme portları) |
| **SSL/TLS** | Certbot ile Let's Encrypt ücretsiz HTTPS sertifikası |
| **Güvenlik Duvarı** | UFW: sadece SSH, HTTP (80), HTTPS (443) açık |
| **Veritabanı** | PostgreSQL kullanıcı izolasyonu, şifreli bağlantı |
| **Yedekleme** | Günlük otomatik `pg_dump`, 7 günlük rotasyon |
| **Süreç Yönetimi** | PM2: auto-restart, 2GB bellek limiti, crash recovery |

---

## 🗺️ Yol Haritası (Roadmap)

- [x] Çift tema motoru (Cyber-HUD & Cozy Pixel Kafe) ve ses efektli Glitch geçişi
- [x] Etkinlik yönetimi, geri sayım sayacı ve takvim entegrasyonu
- [x] Kariyer & staj platformu (filtreler, başvuru linkleri)
- [x] Topluluk projeleri vitrini ve beğeni sistemi
- [x] Payload CMS v3 entegrasyonu (koleksiyonlar, globaller, medya)
- [x] PostgreSQL veritabanı migrasyonu
- [x] VPS deploy altyapısı (Nginx, PM2, SSL, yedekleme)
- [x] Sponsor yönetimi
- [x] WhatsApp topluluk kuralları onay modalı
- [x] CMS'den yönetilebilir sayfa başlık/açıklama ayarları
- [ ] Topluluk üye profilleri & "Buluşmadayım" QR check-in sistemi
- [ ] E-posta / WhatsApp etkinlik hatırlatma bildirimleri
- [ ] Blog / Yazılar bölümü (topluluk üyelerinin teknik makaleleri)

---

## 💬 Topluluğa Katılın

Uşak'ta teknoloji üretiyor, öğreniyor ya da samimi bir ortamda kahve eşliğinde sohbet etmek istiyorsanız aramıza davetlisiniz:

- 💬 **WhatsApp Topluluğu:** [Katılmak İçin Tıklayın](https://chat.whatsapp.com/G4lE8B7s1h696jM7q5hUfR)
- 📸 **Instagram:** [@localhostusak](https://instagram.com/localhostusak)
- 💻 **GitHub:** [localhost_usak_website](https://github.com/RecepSamiOzdemir/localhost_usak_website)

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında açık kaynak olarak geliştirilmektedir. Topluluğa katkıda bulunmaktan çekinmeyin!
