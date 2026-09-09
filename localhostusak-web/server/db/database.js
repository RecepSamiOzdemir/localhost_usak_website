import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

  console.log('✓ SQLite Database initialized successfully at:', dbPath);
}
