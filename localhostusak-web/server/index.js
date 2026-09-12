import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';

import { initDatabase } from './db/database.js';
import { eventTypesRouter } from './routes/eventTypes.js';
import { eventsRouter } from './routes/events.js';
import { careersRouter } from './routes/careers.js';
import { projectsRouter } from './routes/projects.js';
import { linksRouter } from './routes/links.js';
import { authRouter } from './routes/auth.js';
import { requireAuth } from './middleware/authMiddleware.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Bilgi İfşasını Önleme (X-Powered-By başlığını gizle)
app.disable('x-powered-by');

// 2. Helmet ile Güvenlik HTTP Başlıkları
app.use(
  helmet({
    contentSecurityPolicy: false, // Swagger UI ve API entegrasyonu için
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 3. Sıkılaştırılmış CORS Politikası (Sadece İzin Verilen Origin'ler)
const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawCorsOrigin.split(',').map((o) => o.trim());

// Geliştirme ortamında ek yerel origin'lere izin ver
if (process.env.NODE_ENV !== 'production') {
  if (!allowedOrigins.includes('http://127.0.0.1:5173')) {
    allowedOrigins.push('http://127.0.0.1:5173');
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Tarayıcı dışı doğrudan istekler (cURL, Postman veya mobile apps) için origin undefined gelebilir
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS kısıtlaması: "${origin}" adresinden gelen isteklere izin verilmiyor.`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 4. Request Body Boyut Sınırı (DoS & Payload Flood Koruması - max 20kb)
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// 5. Global API Hız Sınırlayıcı (DDoS & Scraping Koruması)
app.use('/api', apiLimiter);

// Initialize SQLite database
initDatabase();

// 6. Swagger API Dokümantasyonu (Prodüksiyonda varsayılan olarak gizlenir)
const isSwaggerEnabled =
  process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';

if (isSwaggerEnabled) {
  try {
    const swaggerSpec = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
    );
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/docs', (req, res) => res.redirect('/api/docs'));
  } catch (err) {
    console.warn('Swagger dokümantasyon dosyası okunamadı:', err.message);
  }
} else {
  const docsDisabledHandler = (req, res) => {
    res.status(404).json({
      error: 'API dokümantasyonu prodüksiyon ortamında güvenlik nedeniyle devre dışı bırakılmıştır.',
      code: 'DOCS_DISABLED',
    });
  };
  app.use('/api/docs', docsDisabledHandler);
  app.use('/docs', docsDisabledHandler);
}

// Auth routes (Brute-force kalkanı ile korunur)
app.use('/api/auth', authLimiter, authRouter);

// Global protection for any route starting with /api/admin
app.use('/api/admin', requireAuth);

// Route mappings
app.use('/api/event-types', eventTypesRouter);
app.use('/api/admin/event-types', eventTypesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/admin/events', eventsRouter);
app.use('/api/careers', careersRouter);
app.use('/api/admin/careers', careersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/admin/projects', projectsRouter);
app.use('/api/links', linksRouter);
app.use('/api/admin/links', linksRouter);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Hata Yakalama Middleware'i
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'İstek gövdesi çok büyük. Maksimum kabul edilen boyut: 20KB',
      code: 'PAYLOAD_TOO_LARGE',
    });
  }

  if (err.message && err.message.includes('CORS kısıtlaması')) {
    return res.status(403).json({
      error: 'Erişim Reddedildi: CORS İhlali',
      message: err.message,
    });
  }

  console.error('Sunucu Hatası:', err.message || err);
  res.status(500).json({ error: 'Sunucu tarafında bir hata oluştu.' });
});

app.listen(PORT, () => {
  console.log(`🚀 localhostusak Backend Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger UI Documentation available at http://localhost:${PORT}/api/docs`);
});
