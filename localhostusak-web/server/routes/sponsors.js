import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateSponsor } from '../middleware/validators.js';
import { logAudit } from '../middleware/auditLogger.js';

export const sponsorsRouter = Router();

function formatSponsor(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    sortOrder: Number(row.sort_order) || 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/sponsors (veya /api/admin/sponsors)
sponsorsRouter.get('/', (req, res) => {
  try {
    const { all } = req.query;
    // Eğer 'all=true' gönderilmişse (admin için), tümünü döner; aksi halde yalnızca aktif olanları
    let query = 'SELECT * FROM sponsors';
    if (all !== 'true') {
      query += ' WHERE is_active = 1';
    }
    query += ' ORDER BY sort_order ASC, created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all();
    res.json(rows.map(formatSponsor));
  } catch (err) {
    console.error('[SPONSORS_GET_ERROR]:', err.message);
    res.status(500).json({ error: 'Sponsorlar yüklenirken bir hata oluştu.' });
  }
});

// GET /api/sponsors/:id
sponsorsRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM sponsors WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Sponsor bulunamadı.' });
    res.json(formatSponsor(row));
  } catch (err) {
    console.error('[SPONSORS_GET_BY_ID_ERROR]:', err.message);
    res.status(500).json({ error: 'Sponsor detayları getirilemedi.' });
  }
});

// POST /api/admin/sponsors
sponsorsRouter.post('/', requireAuth, validateSponsor, (req, res) => {
  try {
    const { name, logoUrl, websiteUrl, sortOrder = 0, isActive = 1 } = req.body;
    const stmt = db.prepare(`
      INSERT INTO sponsors (name, logo_url, website_url, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      logoUrl,
      websiteUrl,
      sortOrder,
      isActive ? 1 : 0
    );

    logAudit(req, 'CREATE_SPONSOR', { name, websiteUrl });
    res.status(201).json({
      success: true,
      message: 'Sponsor başarıyla eklendi.',
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error('[SPONSORS_CREATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Sponsor eklenirken bir hata oluştu.' });
  }
});

// PUT /api/admin/sponsors/:id
sponsorsRouter.put('/:id', requireAuth, validateSponsor, (req, res) => {
  try {
    const { name, logoUrl, websiteUrl, sortOrder = 0, isActive = 1 } = req.body;
    const stmt = db.prepare(`
      UPDATE sponsors
      SET name = ?, logo_url = ?, website_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      name,
      logoUrl,
      websiteUrl,
      sortOrder,
      isActive ? 1 : 0,
      req.params.id
    );

    logAudit(req, 'UPDATE_SPONSOR', { id: req.params.id, name, websiteUrl });
    res.json({ success: true, message: 'Sponsor başarıyla güncellendi.' });
  } catch (err) {
    console.error('[SPONSORS_UPDATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Sponsor güncellenirken bir hata oluştu.' });
  }
});

// DELETE /api/admin/sponsors/:id
sponsorsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM sponsors WHERE id = ?');
    stmt.run(req.params.id);
    logAudit(req, 'DELETE_SPONSOR', { id: req.params.id });
    res.json({ success: true, message: 'Sponsor başarıyla silindi.' });
  } catch (err) {
    console.error('[SPONSORS_DELETE_ERROR]:', err.message);
    res.status(500).json({ error: 'Sponsor silinirken bir hata oluştu.' });
  }
});
