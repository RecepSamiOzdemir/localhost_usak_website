import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const projectsRouter = Router();

function formatProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
    owner: row.owner,
    teamSize: row.team_size,
    teamMax: row.team_max,
    rolesNeeded: row.roles_needed ? JSON.parse(row.roles_needed) : [],
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    imageUrl: row.image_url,
    likes: row.likes,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/projects
projectsRouter.get('/', (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM projects WHERE is_active = 1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY likes DESC, created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    res.json(rows.map(formatProject));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
projectsRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Project not found' });
    res.json(formatProject(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/projects/:id/like
projectsRouter.patch('/:id/like', (req, res) => {
  try {
    const stmt = db.prepare('UPDATE projects SET likes = likes + 1 WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true, message: 'Project liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/projects or /api/projects
projectsRouter.post('/', requireAuth, (req, res) => {
  try {
    const {
      name,
      description,
      type,
      technologies,
      owner,
      teamSize,
      teamMax,
      rolesNeeded,
      githubUrl,
      demoUrl,
      imageUrl,
    } = req.body;
    const stmt = db.prepare(`
      INSERT INTO projects (name, description, type, technologies, owner, team_size, team_max, roles_needed, github_url, demo_url, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      name,
      description || '',
      type || 'showcase',
      JSON.stringify(technologies || []),
      owner || '@topluluk',
      teamSize || 1,
      teamMax || null,
      JSON.stringify(rolesNeeded || []),
      githubUrl || null,
      demoUrl || null,
      imageUrl || null
    );

    res.status(201).json({ success: true, message: 'Project created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/projects/:id
projectsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
