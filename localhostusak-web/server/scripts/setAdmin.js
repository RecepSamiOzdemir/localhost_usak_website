import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('\n❌ Hatalı kullanım!');
  console.log('Kullanım: node scripts/setAdmin.js <kullaniciAdi> <yeniSifre>');
  console.log('Örnek:    node scripts/setAdmin.js admin GucluSifre2026!\n');
  process.exit(1);
}

if (password.length < 6) {
  console.log('\n⚠️ Şifre en az 6 karakter uzunluğunda olmalıdır!\n');
  process.exit(1);
}

const saltRounds = 10;
const hashedPassword = bcrypt.hashSync(password, saltRounds);

try {
  const existing = db.prepare('SELECT id, username FROM admins WHERE username = ?').get(username);

  if (existing) {
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hashedPassword, existing.id);
    console.log(`\n✅ Başarılı: "${username}" kullanıcısının parolası güvenli bcrypt hash'i ile güncellendi.`);
  } else {
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, hashedPassword);
    console.log(`\n✅ Başarılı: Yeni "${username}" admin kullanıcısı oluşturuldu.`);
  }

  console.log(`🔒 Yeni Parola: ${password}`);
  console.log(`🔑 Oluşturulan Hash: ${hashedPassword}\n`);
} catch (err) {
  console.error('Hata oluştu:', err.message);
  process.exit(1);
}
