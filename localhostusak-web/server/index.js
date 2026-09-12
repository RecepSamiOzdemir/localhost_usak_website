import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDatabase();

// Swagger Documentation
const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/docs', (req, res) => res.redirect('/api/docs'));

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

app.listen(PORT, () => {
  console.log(`🚀 localhostusak Backend Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger UI Documentation available at http://localhost:${PORT}/api/docs`);
});
