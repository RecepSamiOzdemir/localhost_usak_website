import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'localhostusak_jwt_secret_dev_key_2026_x89f2a99c71b0';
const TOKEN_EXPIRY = '24h';

/**
 * POST /api/auth/login
 * Admin kullanıcısı için güvenli kimlik doğrulama
 */
authRouter.post('/login', (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        error: 'Kullanıcı adı ve şifre gereklidir.',
        code: 'MISSING_CREDENTIALS',
      });
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length > 50 || password.length > 128) {
      return res.status(400).json({
        error: 'Geçersiz parametre uzunluğu.',
        code: 'INVALID_LENGTH',
      });
    }

    const stmt = db.prepare('SELECT id, username, password_hash FROM admins WHERE username = ?');
    const admin = stmt.get(trimmedUsername);

    // Kullanıcı adı numaralandırma (enumeration) saldırılarına karşı jenerik hata mesajı
    if (!admin) {
      return res.status(401).json({
        error: 'Kullanıcı adı veya şifre hatalı.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Kullanıcı adı veya şifre hatalı.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.json({
      success: true,
      message: 'Giriş başarılı.',
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Giriş işlemi sırasında bir hata oluştu.' });
  }
});

/**
 * GET /api/auth/verify & POST /api/auth/verify
 * Mevcut JWT token'ının geçerliliğini ve oturum durumunu denetler
 */
const verifyHandler = (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
};

authRouter.get('/verify', requireAuth, verifyHandler);
authRouter.post('/verify', requireAuth, verifyHandler);

/**
 * POST /api/auth/change-password
 * Giriş yapmış admin kullanıcısının şifresini güvenle güncellemesi
 */
authRouter.post('/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword || typeof newPassword !== 'string') {
      return res.status(400).json({
        error: 'Mevcut şifre ve yeni şifre gereklidir.',
        code: 'MISSING_FIELDS',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Yeni şifre en az 6 karakter uzunluğunda olmalıdır.',
        code: 'PASSWORD_TOO_SHORT',
      });
    }

    const stmt = db.prepare('SELECT id, username, password_hash FROM admins WHERE id = ?');
    const admin = stmt.get(req.user.id);

    if (!admin) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Mevcut şifreniz hatalı.',
        code: 'INVALID_CURRENT_PASSWORD',
      });
    }

    const newHashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateStmt = db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
    updateStmt.run(newHashedPassword, admin.id);

    return res.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi.',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Şifre güncellenirken bir hata oluştu.' });
  }
});
