import { Router } from 'express';
import { db } from '../db/database.js';

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
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/event-types or /api/event-types
eventTypesRouter.post('/', (req, res) => {
  try {
    const { id, label, icon, colorModern, colorPixel, sortOrder } = req.body;
    if (!id || !label) {
      return res.status(400).json({ error: 'id and label are required' });
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

    res.status(201).json({ success: true, message: 'Event type created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/event-types/:id
eventTypesRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const checkStmt = db.prepare('SELECT is_default FROM event_types WHERE id = ?');
    const existing = checkStmt.get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    if (existing.is_default) {
      return res.status(400).json({ error: 'Default event types cannot be deleted' });
    }

    const deleteStmt = db.prepare('DELETE FROM event_types WHERE id = ?');
    deleteStmt.run(id);

    res.json({ success: true, message: 'Event type deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
