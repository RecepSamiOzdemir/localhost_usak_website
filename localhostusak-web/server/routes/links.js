import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const linksRouter = Router();

// Ensure community_links table exists even if server is running
db.exec(`
  CREATE TABLE IF NOT EXISTS community_links (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    label TEXT,
    description TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default links if table is empty
const countResult = db.prepare('SELECT count(*) as count FROM community_links').get();
if (countResult && countResult.count === 0) {
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO community_links (id, url, label, description) VALUES
    ('whatsapp_general', 'https://chat.whatsapp.com/', 'WhatsApp Topluluğu', 'Genel topluluk duyuru ve sohbet grubu'),
    ('whatsapp_projects', 'https://chat.whatsapp.com/dummy-projeler', 'WhatsApp Projeler Grubu', 'Açık kaynak ve topluluk projeleri grubu'),
    ('whatsapp_careers', 'https://chat.whatsapp.com/dummy-kariyer', 'WhatsApp Kariyer Grubu', 'İş, staj ve mentörlük paylaşımları'),
    ('whatsapp_coworking', 'https://chat.whatsapp.com/dummy-coworking', 'WhatsApp Coworking Grubu', 'Fiziksel buluşmalar ve coworking masası'),
    ('instagram', 'https://instagram.com/localhostusak', 'Instagram', 'Sosyal medya hesabı'),
    ('github', 'https://github.com/localhostusak', 'GitHub', 'Açık kaynak organizasyon deposu'),
    ('x', 'https://x.com/localhostusak', 'X / Twitter', 'Resmi X hesabı');
  `);
  insertStmt.run();
}

// Helper to convert rows to camelCase key-value map
function formatLinksResponse(rows) {
  const map = {};
  for (const row of rows) {
    if (row.id === 'whatsapp_general') map.whatsappGeneral = row.url;
    else if (row.id === 'whatsapp_projects') map.whatsappProjects = row.url;
    else if (row.id === 'whatsapp_careers') map.whatsappCareers = row.url;
    else if (row.id === 'whatsapp_coworking') map.whatsappCoworking = row.url;
    else if (row.id === 'instagram') map.instagram = row.url;
    else if (row.id === 'github') map.github = row.url;
    else if (row.id === 'x') map.x = row.url;
    else map[row.id] = row.url;
  }
  return {
    links: map,
    items: rows,
  };
}

// GET /api/links or /api/admin/links
linksRouter.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, url, label, description, updated_at as updatedAt FROM community_links').all();
    res.json(formatLinksResponse(rows));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/links or POST /api/admin/links
linksRouter.put('/', requireAuth, (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Request body must be an object' });
    }

    const mapping = {
      whatsappGeneral: 'whatsapp_general',
      whatsappProjects: 'whatsapp_projects',
      whatsappCareers: 'whatsapp_careers',
      whatsappCoworking: 'whatsapp_coworking',
      instagram: 'instagram',
      github: 'github',
      x: 'x',
    };

    const updateStmt = db.prepare(`
      INSERT INTO community_links (id, url, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        url = excluded.url,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Handle key-value object
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.trim()) {
        const dbKey = mapping[key] || key;
        updateStmt.run(dbKey, value.trim());
      }
    }

    const updatedRows = db.prepare('SELECT id, url, label, description, updated_at as updatedAt FROM community_links').all();
    res.json({
      success: true,
      message: 'Topluluk bağlantıları başarıyla güncellendi',
      ...formatLinksResponse(updatedRows),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias POST to PUT
linksRouter.post('/', requireAuth, (req, res) => {
  return linksRouter.handle(Object.assign(req, { method: 'PUT' }), res);
});
