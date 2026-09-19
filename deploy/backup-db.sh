#!/usr/bin/env bash
# ==============================================================================
# localhostusak — Otomatik PostgreSQL Günlük Yedekleme Scripti
# Konum: /var/www/localhostusak/deploy/backup-db.sh
# Cron kurulumu (Her gece 03:00):
# 0 3 * * * /bin/bash /var/www/localhostusak/deploy/backup-db.sh >> /var/log/db-backup.log 2>&1
# ==============================================================================

set -eo pipefail

# Ayarlar
BACKUP_DIR="/var/backups/localhostusak"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="localhostusak"
DB_USER="localhostusak_user"
RETENTION_DAYS=7

# Veritabanı parolası: ~/.pgpass dosyasından veya ortam değişkeninden okunur.
# Gerekirse doğrudan buraya da yazılabilir: export PGPASSWORD="<PAROLANIZ>"
export PGPASSWORD="${PGPASSWORD:-}"

# Yedek dizinini oluştur
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

echo "[$(date)] PostgreSQL yedekleme başlatılıyor: $DB_NAME"

# Veritabanı yedeğini sıkıştırarak al (pipefail sayesinde pg_dump hata verirse durur)
pg_dump -U "$DB_USER" -h localhost -d "$DB_NAME" | gzip > "$BACKUP_FILE"

# Dosya boyutunu göster
FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Yedek başarıyla alındı: $BACKUP_FILE ($FILESIZE)"

# 7 günden eski yedekleri temizle
echo "[$(date)] $RETENTION_DAYS günden eski yedekler temizleniyor..."
find "$BACKUP_DIR" -type f -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} +

echo "[$(date)] Yedekleme işlemi başarıyla tamamlandı."
