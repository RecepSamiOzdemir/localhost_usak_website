import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'localhostusak.sqlite');
export const db = new DatabaseSync(dbPath);

// Initialize schema and seeds
export function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
  }

  // Güvenlik: Eğer veritabanında plaintext şifre varsa bcrypt ile hashle
  try {
    const admins = db.prepare('SELECT id, username, password_hash FROM admins').all();
    for (const admin of admins) {
      if (admin.password_hash && !admin.password_hash.startsWith('$2')) {
        const hashed = bcrypt.hashSync(admin.password_hash, 10);
        db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hashed, admin.id);
        console.log(`🔒 Güvenlik: "${admin.username}" kullanıcısının düz metin parolası bcrypt ile hashlenerek güncellendi.`);
      }
    }
  } catch (e) {
    // Admins tablosu yoksa veya okunamadıysa
  }

  console.log('✓ SQLite Database initialized successfully at:', dbPath);
}
