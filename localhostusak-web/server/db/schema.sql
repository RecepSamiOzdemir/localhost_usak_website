-- ============================================================
-- Etkinlik Türleri (Dinamik — Admin Panelinden Yönetilir)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_types (
  id            TEXT PRIMARY KEY,        -- "cowork", "workshop", "talk", "hackathon"...
  label         TEXT NOT NULL,           -- "Cowork", "Workshop"
  icon          TEXT NOT NULL,           -- "☕", "🛠️", "🎤"
  color_modern  TEXT NOT NULL,           -- "#FF6600"
  color_pixel   TEXT NOT NULL,           -- "#EE6C19"
  is_default    INTEGER DEFAULT 0,       -- Varsayılan tipler silinemez
  sort_order    INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Etkinlikler
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  description   TEXT,
  type_id       TEXT NOT NULL REFERENCES event_types(id),
  status        TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming','completed','cancelled')),
  date_start    TEXT NOT NULL,
  date_end      TEXT,
  location      TEXT,
  map_url       TEXT,
  capacity      INTEGER,
  attendees     INTEGER DEFAULT 0,
  image_url     TEXT,
  whatsapp_link TEXT,
  tags          TEXT,                    -- JSON array: '["#WebDev","#AI"]'
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Kariyer İlanları
-- ============================================================
CREATE TABLE IF NOT EXISTS careers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL,
  company       TEXT,
  type          TEXT NOT NULL CHECK(type IN ('job','internship','freelance','mentorship')),
  work_mode     TEXT CHECK(work_mode IN ('remote','hybrid','onsite')),
  schedule      TEXT CHECK(schedule IN ('fulltime','parttime','project')),
  description   TEXT,
  technologies  TEXT,                    -- JSON array: '["React","Node.js"]'
  apply_url     TEXT,
  contact       TEXT,
  posted_by     TEXT,
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at    TEXT
);

-- ============================================================
-- Projeler
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  description   TEXT,
  type          TEXT NOT NULL CHECK(type IN ('showcase','seeking_team','opensource')),
  technologies  TEXT,                    -- JSON array
  owner         TEXT,
  team_size     INTEGER DEFAULT 1,
  team_max      INTEGER,
  roles_needed  TEXT,                    -- JSON array
  github_url    TEXT,
  demo_url      TEXT,
  image_url     TEXT,
  likes         INTEGER DEFAULT 0,
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Admin Kullanıcıları
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Topluluk & WhatsApp Bağlantıları
-- ============================================================
CREATE TABLE IF NOT EXISTS community_links (
  id            TEXT PRIMARY KEY,        -- "whatsapp_general", "whatsapp_projects", etc.
  url           TEXT NOT NULL,
  label         TEXT,
  description   TEXT,
  updated_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Güvenlik ve Denetim Günlüğü (Audit Logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id       INTEGER,
  admin_username TEXT,
  action         TEXT NOT NULL,
  details        TEXT,
  ip_address     TEXT,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);

