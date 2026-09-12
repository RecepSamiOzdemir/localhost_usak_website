import rateLimit from 'express-rate-limit';

/**
 * Global API Hız Sınırlayıcı (DDoS & Web Scraping Önleme)
 * 15 dakikalık pencerede IP başına maksimum 300 istek
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'İstek sınırı aşıldı. Lütfen bir süre sonra tekrar deneyin.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

/**
 * Giriş / Kimlik Doğrulama Hız Sınırlayıcı (Kaba Kuvvet / Brute-force Önleme)
 * 15 dakikalık pencerede IP başına maksimum 10 deneme
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Çok fazla başarısız veya ardışık istek yapıldı. Güvenliğiniz için erişim 15 dakika kısıtlandı.',
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
    });
  },
});
