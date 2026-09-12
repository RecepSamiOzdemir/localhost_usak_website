import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Kullanım: node scripts/hashPassword.js <sifre>');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n--- BCRYPT ŞİFRE HASHLEME ---');
console.log(`Girdi: ${password}`);
console.log(`Oluşturulan bcrypt Hash: ${hash}`);
console.log('-----------------------------\n');
