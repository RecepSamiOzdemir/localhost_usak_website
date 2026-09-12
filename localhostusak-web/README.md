# localhostusak-web

Bu klasör, **localhost[uşak]** platformunun React 19 Frontend ve Node.js Native SQLite Backend servislerini içerir.

Detaylı proje mimarisi, tasarım dili ve tüm özellikler için ana dokümantasyonu inceleyin:  
👉 [**Ana Dokümantasyon & Proje README.md**](../README.md)

---

### 🚀 Hızlı Başlatma

```bash
# 1. Bağımlılıkları yükleyin
npm install
npm --prefix server install

# 2. Backend servisini başlatın (Port 3001, Native SQLite & Swagger)
npm run server

# 3. Frontend servisini başlatın (Port 5173, Vite HMR)
npm run dev

# 4. Üretim paketi derleme kontrolü
npm run build
```

---

### 💬 WhatsApp & Topluluk Bağlantılarını Güncelleme

Platformdaki tüm WhatsApp grup linkleri (Genel Topluluk, Projeler, Kariyer, Coworking) ve sosyal medya hesapları merkezi bir yapıdan beslenir:

1. **Admin Paneli Üzerinden (Önerilen):**
   - Tarayıcınızda `http://localhost:5173/admin` adresini açın.
   - **"💬 WhatsApp & Linkler"** sekmesine geçiş yapın.
   - Linklerinizi düzenleyip sağdaki **"Test ↗"** butonuyla test edin ve **"💾 Bağlantıları Kaydet"** butonuna basın. Değişiklikler anında SQLite veritabanına işlenir ve sitede canlı olarak güncellenir.

2. **Kaynak Kod Üzerinden (Varsayılanlar):**
   - [`src/constants/links.ts`](src/constants/links.ts) dosyasındaki `DEFAULT_COMMUNITY_LINKS` nesnesini düzenlemeniz yeterlidir.

---

### 📁 Klasör Mimarisi
- `src/constants/links.ts` - Merkezi link konfigürasyonu ve meta verileri
- `src/context/LinksContext.tsx` - Canlı link senkronizasyon motoru
- `src/pages/AdminPage.tsx` - Yönetim paneli (Etkinlikler, İlanlar, Projeler ve Linkler)
- `server/routes/links.js` - `/api/links` ve `/api/admin/links` SQLite REST uçları
- `server/db/schema.sql` - `community_links` tablo şeması

