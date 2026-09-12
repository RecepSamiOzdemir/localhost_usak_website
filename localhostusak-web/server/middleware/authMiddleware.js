import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'localhostusak_jwt_secret_dev_key_2026_x89f2a99c71b0';

/**
 * Express middleware to verify JWT authorization token in requests
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Yetkilendirme hatası: Giriş yapmanız gerekmektedir.',
      code: 'AUTH_REQUIRED',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Yetkilendirme hatası: Geçersiz token biçimi.',
      code: 'INVALID_FORMAT',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      error: 'Geçersiz veya bozulmuş yetki jetonu.',
      code: 'INVALID_TOKEN',
    });
  }
}
