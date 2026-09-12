import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateEventType } from '../middleware/validators.js';
import { logAudit } from '../middleware/auditLogger.js';

export const eventTypesRouter = Router();

// GET /api/event-types
eventTypesRouter.get('/', (req, res) => {
  try {
    const stmt = db.prepare(
      'SELECT id, label, icon, color_modern as colorModern, color_pixel as colorPixel, is_default as isDefault, sort_order as sortOrder FROM event_types ORDER BY sort_order ASC, created_at ASC'
    );
    const rows = stmt.all();
    res.json(rows.map((r) => ({ ...r, isDefault: Boolean(r.isDefault) })));
  } catch (err) {
    console.error('[EVENT_TYPES_GET_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik türleri yüklenirken bir hata oluştu.' });
  }
});

// POST /api/admin/event-types or /api/event-types
eventTypesRouter.post('/', requireAuth, validateEventType, (req, res) => {
  try {
    const { id, label, icon, colorModern, colorPixel, sortOrder } = req.body;
    if (!id || !label) {
      return res.status(400).json({ error: 'Etkinlik türü ID ve etiket zorunludur.' });
    }

    const stmt = db.prepare(`
      INSERT INTO event_types (id, label, icon, color_modern, color_pixel, is_default, sort_order)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `);
    stmt.run(
      id.toLowerCase().trim().replace(/\s+/g, '_'),
      label.trim(),
      icon || '⚡',
      colorModern || '#FF6600',
      colorPixel || '#EE6C19',
      sortOrder || 99
    );

    logAudit(req, 'CREATE_EVENT_TYPE', { id, label });
    res.status(201).json({ success: true, message: 'Etkinlik türü başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('[EVENT_TYPES_CREATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik türü oluşturulurken bir hata oluştu.' });
  }
});

// DELETE /api/admin/event-types/:id
eventTypesRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare('SELECT is_default FROM event_types WHERE id = ?');
    const existing = checkStmt.get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Etkinlik türü bulunamadı.' });
    }
    if (existing.is_default) {
      return res.status(400).json({ error: 'Varsayılan etkinlik türleri silinemez.' });
    }

    const deleteStmt = db.prepare('DELETE FROM event_types WHERE id = ?');
    deleteStmt.run(id);

    logAudit(req, 'DELETE_EVENT_TYPE', { id });
    res.json({ success: true, message: 'Etkinlik türü başarıyla silindi.' });
  } catch (err) {
    console.error('[EVENT_TYPES_DELETE_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik türü silinirken bir hata oluştu.' });
  }
});
