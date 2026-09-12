import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateCareer } from '../middleware/validators.js';
import { logAudit } from '../middleware/auditLogger.js';

export const careersRouter = Router();

function formatCareer(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    type: row.type,
    workMode: row.work_mode,
    schedule: row.schedule,
    description: row.description,
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
    applyUrl: row.apply_url,
    contact: row.contact,
    postedBy: row.posted_by,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

// GET /api/careers
careersRouter.get('/', (req, res) => {
  try {
    const { type, work_mode } = req.query;
    let query = 'SELECT * FROM careers WHERE is_active = 1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (work_mode && work_mode !== 'all') {
      query += ' AND work_mode = ?';
      params.push(work_mode);
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows.map(formatCareer));
  } catch (err) {
    console.error('[CAREERS_GET_ERROR]:', err.message);
    res.status(500).json({ error: 'Kariyer ilanları yüklenirken bir hata oluştu.' });
  }
});

// GET /api/careers/:id
careersRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM careers WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'İlan bulunamadı.' });
    res.json(formatCareer(row));
  } catch (err) {
    console.error('[CAREERS_GET_BY_ID_ERROR]:', err.message);
    res.status(500).json({ error: 'İlan detayları getirilemedi.' });
  }
});

// POST /api/admin/careers or /api/careers
careersRouter.post('/', requireAuth, validateCareer, (req, res) => {
  try {
    const {
      title,
      company,
      type,
      workMode,
      schedule,
      description,
      technologies,
      applyUrl,
      contact,
      postedBy,
    } = req.body;
    const stmt = db.prepare(`
      INSERT INTO careers (title, company, type, work_mode, schedule, description, technologies, apply_url, contact, posted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      title,
      company || '',
      type || 'job',
      workMode || 'remote',
      schedule || 'fulltime',
      description || '',
      JSON.stringify(technologies || []),
      applyUrl || null,
      contact || null,
      postedBy || '@admin'
    );

    logAudit(req, 'CREATE_CAREER', { title, company, type });
    res.status(201).json({ success: true, message: 'Kariyer ilanı başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('[CAREERS_CREATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Kariyer ilanı oluşturulurken bir hata oluştu.' });
  }
});

// DELETE /api/admin/careers/:id
careersRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM careers WHERE id = ?');
    stmt.run(req.params.id);
    logAudit(req, 'DELETE_CAREER', { id: req.params.id });
    res.json({ success: true, message: 'Kariyer ilanı başarıyla silindi.' });
  } catch (err) {
    console.error('[CAREERS_DELETE_ERROR]:', err.message);
    res.status(500).json({ error: 'Kariyer ilanı silinirken bir hata oluştu.' });
  }
});
