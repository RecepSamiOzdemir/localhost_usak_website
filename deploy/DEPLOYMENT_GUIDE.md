# 🚀 localhostusak — Keybuu Ubuntu VPS (12GB RAM) Dağıtım Rehberi

Bu rehber, projenin **Keybuu Ubuntu VPS** üzerinde **Payload CMS (v3) + PostgreSQL 16 + React 19 Vite SPA** mimarisiyle sıfırdan canlıya alınması için gereken tüm adımları adım adım anlatır.

---

## 📋 Gereksinimler & VPS Hazırlığı

Sunucuna SSH ile bağlandıktan sonra temel paketleri kur:

```bash
# 1. Sistemi güncelle
sudo apt update && sudo apt upgrade -y

# 2. Gerekli araçları kur
sudo apt install -y curl git ufw nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# 3. Node.js 22 LTS Kurulumu
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 4. PM2 Süreç Yöneticisini Global Kur
sudo npm install -g pm2
```

---

## 🗄️ Adım 1: PostgreSQL 16 Veritabanını Hazırlama

```bash
# PostgreSQL shell'ine bağlan
sudo -u postgres psql

# Veritabanı ve kullanıcıyı oluştur (GÜÇLÜ bir parola belirleyin!)
CREATE DATABASE localhostusak;
CREATE USER localhostusak_user WITH ENCRYPTED PASSWORD '<GUCLU_VERITABANI_PAROLANIZ>';
GRANT ALL PRIVILEGES ON DATABASE localhostusak TO localhostusak_user;
ALTER DATABASE localhostusak OWNER TO localhostusak_user;

# Çıkış yap
\q
```

---

## 📁 Adım 2: Projeyi VPS'e Çekme

```bash
# Web dizinine git ve repository'yi klonla
sudo mkdir -p /var/www/localhostusak
sudo chown -R $USER:$USER /var/www/localhostusak
cd /var/www/localhostusak

# Git reposunu klonla ve cms branch'ine geç
git clone https://github.com/RecepSamiOzdemir/localhost_usak_website.git .
git checkout cms
```

---

## ⚙️ Adım 3: Payload CMS'i Derleme ve PM2 ile Başlatma

```bash
cd /var/www/localhostusak/localhostusak-cms

# Bağımlılıkları kur
npm install

# 64 karakterli güvenli bir rastgele PAYLOAD_SECRET üretmek için:
# openssl rand -hex 32

# .env dosyasını oluştur (Parolanızı ve ürettiğiniz secret'ı girin)
cat << 'EOF' > .env
DATABASE_URL=postgresql://localhostusak_user:<GUCLU_VERITABANI_PAROLANIZ>@localhost:5432/localhostusak
PAYLOAD_SECRET=<OPENSSL_ILE_URETTIGINIZ_64_KARAKTERLI_SECRET>
PORT=3000
NODE_ENV=production
EOF

# CMS'i production için derle
npm run build

# PM2 ile arka planda başlat ve sistemi yeniden başlatmalara karşı kaydet
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

pm2 start /var/www/localhostusak/deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 🎨 Adım 4: Frontend'i (Vite React) Derleme

```bash
cd /var/www/localhostusak/localhostusak-web

# Bağımlılıkları kur
npm install

# Production build al (/var/www/localhostusak/localhostusak-web/dist oluşur)
npm run build
```

---

## 🌐 Adım 5: Nginx ve SSL (HTTPS) Kurulumu

```bash
# Hazırladığımız Nginx konfigürasyonunu kopyala ve aktifleştir
sudo cp /var/www/localhostusak/deploy/nginx/localhostusak.conf /etc/nginx/sites-available/localhostusak.conf
sudo ln -s /etc/nginx/sites-available/localhostusak.conf /etc/nginx/sites-enabled/

# Varsayılan nginx karşılama sayfasını kaldır
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx sözdizimini test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# ----------------------------------------------------------------------
# ÜCRETSİZ SSL (HTTPS) KURULUMU
# Domain DNS kayıtlarının (A kaydı) VPS IP adresine yönlendiğinden emin ol!
# ----------------------------------------------------------------------
sudo certbot --nginx -d localhostusak.com -d www.localhostusak.com
```

---

## 🛡️ Adım 6: Güvenlik Duvarı (UFW) Ayarı

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 💾 Adım 7: Otomatik Günlük PostgreSQL Yedekleme (Cron)

```bash
# Veritabanı parolasını cron için ~/.pgpass dosyasına kaydet (Güvenli izinlerle):
echo "localhost:5432:localhostusak:localhostusak_user:<GUCLU_VERITABANI_PAROLANIZ>" > ~/.pgpass
chmod 600 ~/.pgpass

# Yedekleme scriptini çalıştırılabilir yap
chmod +x /var/www/localhostusak/deploy/backup-db.sh

# Crontab'ı aç
crontab -e

# Aşağıdaki satırı ekle (Her gece saat 03:00'te çalışır, 7 günden eski yedekleri siler):
0 3 * * * /bin/bash /var/www/localhostusak/deploy/backup-db.sh >> /var/log/db-backup.log 2>&1
```

---

## 🎉 Tebrikler! Sistem Canlıda:

- **Web Sitesi:** `https://localhostusak.com`
- **CMS Yönetim Paneli:** `https://localhostusak.com/admin` (İlk girişte admin kullanıcını oluştur)
- **REST API:** `https://localhostusak.com/api/events`
- **PM2 Durum Kontrolü:** `pm2 status` veya `pm2 logs localhostusak-cms`
