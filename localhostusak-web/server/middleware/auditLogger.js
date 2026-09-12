import { db } from '../db/database.js';

// Audit Logs tablosunun varlığını garantiye al
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    admin_username TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

/**
 * Admin işlemlerini veritabanına ve konsol çıktısına kaydeder
 * @param {import('express').Request} req
 * @param {string} action Örn: 'CREATE_EVENT', 'DELETE_EVENT', 'UPDATE_LINKS'
 * @param {string|object} details İşlem detayı veya özet
 */
export function logAudit(req, action, details = '') {
  try {
    const adminId = req.user?.id || null;
    const adminUsername = req.user?.username || 'anonymous';
    const ipAddress = req.ip || req.socket?.remoteAddress || 'unknown';
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : String(details);

    const stmt = db.prepare(`
      INSERT INTO audit_logs (admin_id, admin_username, action, details, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(adminId, adminUsername, action, detailsStr, ipAddress);

    const timestamp = new Date().toISOString();
    console.log(`🛡️ [AUDIT] ${timestamp} | @${adminUsername} | ${action} | IP: ${ipAddress}`);
  } catch (err) {
    console.error('Audit log kaydedilirken hata oluştu:', err.message);
  }
}
