import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateEvent } from '../middleware/validators.js';
import { logAudit } from '../middleware/auditLogger.js';

export const eventsRouter = Router();

function formatEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    typeId: row.type_id,
    status: row.status,
    dateStart: row.date_start,
    dateEnd: row.date_end,
    location: row.location,
    mapUrl: row.map_url,
    capacity: row.capacity,
    attendees: row.attendees,
    imageUrl: row.image_url,
    whatsappLink: row.whatsapp_link,
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.created_at,
  };
}

// GET /api/events
eventsRouter.get('/', (req, res) => {
  try {
    const { type, status } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type_id = ?';
      params.push(type);
    }
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date_start ASC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows.map(formatEvent));
  } catch (err) {
    console.error('[EVENTS_GET_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlikler yüklenirken bir hata oluştu.' });
  }
});

// GET /api/events/:id
eventsRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Etkinlik bulunamadı.' });
    res.json(formatEvent(row));
  } catch (err) {
    console.error('[EVENTS_GET_BY_ID_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik detayı getirilemedi.' });
  }
});

// POST /api/admin/events or /api/events
eventsRouter.post('/', requireAuth, validateEvent, (req, res) => {
  try {
    const {
      title,
      description,
      typeId,
      status,
      dateStart,
      dateEnd,
      location,
      mapUrl,
      capacity,
      attendees,
      imageUrl,
      whatsappLink,
      tags,
    } = req.body;
    const stmt = db.prepare(`
      INSERT INTO events (title, description, type_id, status, date_start, date_end, location, map_url, capacity, attendees, image_url, whatsapp_link, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      title,
      description || '',
      typeId || 'cowork',
      status || 'upcoming',
      dateStart,
      dateEnd || null,
      location || 'Uşak',
      mapUrl || null,
      capacity || 25,
      attendees || 0,
      imageUrl || null,
      whatsappLink || null,
      JSON.stringify(tags || [])
    );

    logAudit(req, 'CREATE_EVENT', { title, dateStart, typeId });
    res.status(201).json({ success: true, message: 'Etkinlik başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('[EVENTS_CREATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik oluşturulurken bir hata oluştu.' });
  }
});

// PUT /api/admin/events/:id
eventsRouter.put('/:id', requireAuth, validateEvent, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, typeId, status, dateStart, location, capacity, attendees } = req.body;

    const stmt = db.prepare(`
      UPDATE events
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          type_id = COALESCE(?, type_id),
          status = COALESCE(?, status),
          date_start = COALESCE(?, date_start),
          location = COALESCE(?, location),
          capacity = COALESCE(?, capacity),
          attendees = COALESCE(?, attendees),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(title, description, typeId, status, dateStart, location, capacity, attendees, id);
    logAudit(req, 'UPDATE_EVENT', { id, title, status });
    res.json({ success: true, message: 'Etkinlik başarıyla güncellendi.' });
  } catch (err) {
    console.error('[EVENTS_UPDATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik güncellenirken bir hata oluştu.' });
  }
});

// DELETE /api/admin/events/:id
eventsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(req.params.id);
    logAudit(req, 'DELETE_EVENT', { id: req.params.id });
    res.json({ success: true, message: 'Etkinlik başarıyla silindi.' });
  } catch (err) {
    console.error('[EVENTS_DELETE_ERROR]:', err.message);
    res.status(500).json({ error: 'Etkinlik silinirken bir hata oluştu.' });
  }
});
