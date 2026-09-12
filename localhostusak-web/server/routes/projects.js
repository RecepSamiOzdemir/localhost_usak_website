import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateProject } from '../middleware/validators.js';
import { logAudit } from '../middleware/auditLogger.js';

export const projectsRouter = Router();

// Beğeni spamı önleme önbelleği (IP + Proje ID bazlı 1 saatlik cooldown)
const likeCooldowns = new Map();
const LIKE_COOLDOWN_MS = 60 * 60 * 1000; // 1 saat

// Periyodik temizlik (Her 15 dakikada süresi geçmiş kayıtları siler)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of likeCooldowns.entries()) {
    if (now - timestamp > LIKE_COOLDOWN_MS) {
      likeCooldowns.delete(key);
    }
  }
}, 15 * 60 * 1000).unref();

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
    console.error('[PROJECTS_GET_ERROR]:', err.message);
    res.status(500).json({ error: 'Projeler yüklenirken bir hata oluştu.' });
  }
});

// GET /api/projects/:id
projectsRouter.get('/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Proje bulunamadı.' });
    res.json(formatProject(row));
  } catch (err) {
    console.error('[PROJECTS_GET_BY_ID_ERROR]:', err.message);
    res.status(500).json({ error: 'Proje detayı getirilemedi.' });
  }
});

// PATCH /api/projects/:id/like (Beğeni Spamı & Bot Korumalı)
projectsRouter.patch('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown_ip';
    const cooldownKey = `${clientIp}_${id}`;
    const now = Date.now();

    // Projenin varlığını doğrula
    const project = db.prepare('SELECT id, likes FROM projects WHERE id = ?').get(id);
    if (!project) {
      return res.status(404).json({ error: 'Beğenilmek istenen proje bulunamadı.' });
    }

    // Cooldown denetimi
    const lastLiked = likeCooldowns.get(cooldownKey);
    if (lastLiked && now - lastLiked < LIKE_COOLDOWN_MS) {
      return res.status(429).json({
        error: 'Bu projeyi yakın zamanda zaten beğendiniz. Lütfen bir süre sonra tekrar deneyin.',
        code: 'LIKE_COOLDOWN',
      });
    }

    likeCooldowns.set(cooldownKey, now);
    const stmt = db.prepare('UPDATE projects SET likes = likes + 1 WHERE id = ?');
    stmt.run(id);

    res.json({
      success: true,
      message: 'Proje beğenildi!',
      likes: (project.likes || 0) + 1,
    });
  } catch (err) {
    res.status(500).json({ error: 'Beğeni kaydedilirken bir hata oluştu.' });
  }
});

// POST /api/admin/projects or /api/projects
projectsRouter.post('/', requireAuth, validateProject, (req, res) => {
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

    logAudit(req, 'CREATE_PROJECT', { name, type, owner });
    res.status(201).json({ success: true, message: 'Proje başarıyla oluşturuldu.' });
  } catch (err) {
    console.error('[PROJECTS_CREATE_ERROR]:', err.message);
    res.status(500).json({ error: 'Proje oluşturulurken bir hata oluştu.' });
  }
});

// DELETE /api/admin/projects/:id
projectsRouter.delete('/:id', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(req.params.id);
    logAudit(req, 'DELETE_PROJECT', { id: req.params.id });
    res.json({ success: true, message: 'Proje başarıyla silindi.' });
  } catch (err) {
    console.error('[PROJECTS_DELETE_ERROR]:', err.message);
    res.status(500).json({ error: 'Proje silinirken bir hata oluştu.' });
  }
});
