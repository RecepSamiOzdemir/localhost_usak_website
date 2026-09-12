import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';

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
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id
eventsRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(formatEvent(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/events or /api/events
eventsRouter.post('/', requireAuth, (req, res) => {
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

    res.status(201).json({ success: true, message: 'Event created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/events/:id
eventsRouter.put('/:id', requireAuth, (req, res) => {
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
    res.json({ success: true, message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/events/:id
eventsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
