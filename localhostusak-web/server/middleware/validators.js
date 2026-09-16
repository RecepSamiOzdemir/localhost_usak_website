/**
 * Input sanitization and validation helpers
 */

// Basit ve etkili XSS temizleyici (HTML etiketlerini ve zararlı karakter dizilerini zararsız hale getirir)
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script taglarını sil
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframe taglarını sil
    .replace(/javascript:/gi, '') // javascript: protokolünü sil
    .replace(/on\w+\s*=/gi, '') // onclick=, onerror= gibi inline eventleri sil
    .replace(/[<>]/g, (tag) => (tag === '<' ? '&lt;' : '&gt;')) // kalan tag karakterlerini encode et
    .trim();
}

// Güvenli URL doğrulayıcı
export function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true; // Yerel göreceli path (örn: /assets/...)
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Hex Renk formatı doğrulayıcı (#FFF veya #FF6600)
export function isValidHexColor(str) {
  if (!str || typeof str !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(str.trim());
}

/**
 * Etkinlik (Event) Giriş Doğrulama Middleware'i
 */
export function validateEvent(req, res, next) {
  const { title, dateStart, capacity, status, typeId, mapUrl, imageUrl, whatsappLink } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Etkinlik başlığı zorunludur.', field: 'title' });
  }

  if (title.length > 250) {
    return res.status(400).json({ error: 'Etkinlik başlığı en fazla 250 karakter olabilir.', field: 'title' });
  }

  if (!dateStart || isNaN(Date.parse(dateStart))) {
    return res.status(400).json({ error: 'Geçerli bir başlangıç tarihi gereklidir.', field: 'dateStart' });
  }

  if (status && !['upcoming', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Geçersiz etkinlik durumu.', field: 'status' });
  }

  if (capacity !== undefined && (isNaN(Number(capacity)) || Number(capacity) < 0 || Number(capacity) > 10000)) {
    return res.status(400).json({ error: 'Kapasite 0 ile 10000 arasında bir sayı olmalıdır.', field: 'capacity' });
  }

  if (mapUrl && !isValidUrl(mapUrl)) {
    return res.status(400).json({ error: 'Geçersiz harita bağlantısı.', field: 'mapUrl' });
  }

  if (imageUrl && !isValidUrl(imageUrl)) {
    return res.status(400).json({ error: 'Geçersiz görsel bağlantısı.', field: 'imageUrl' });
  }

  if (whatsappLink && !isValidUrl(whatsappLink)) {
    return res.status(400).json({ error: 'Geçersiz WhatsApp bağlantısı.', field: 'whatsappLink' });
  }

  // Sanitization
  req.body.title = sanitizeText(title);
  if (req.body.description) req.body.description = sanitizeText(req.body.description);
  if (req.body.location) req.body.location = sanitizeText(req.body.location);

  next();
}

/**
 * Kariyer İlanı Doğrulama Middleware'i
 */
export function validateCareer(req, res, next) {
  const { title, company, type, workMode, schedule, applyUrl } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'İlan başlığı zorunludur.', field: 'title' });
  }

  if (title.length > 250) {
    return res.status(400).json({ error: 'İlan başlığı en fazla 250 karakter olabilir.', field: 'title' });
  }

  if (type && !['job', 'internship', 'freelance', 'mentorship'].includes(type)) {
    return res.status(400).json({ error: 'Geçersiz kariyer tipi.', field: 'type' });
  }

  if (workMode && !['remote', 'hybrid', 'onsite'].includes(workMode)) {
    return res.status(400).json({ error: 'Geçersiz çalışma modu.', field: 'workMode' });
  }

  if (schedule && !['fulltime', 'parttime', 'project'].includes(schedule)) {
    return res.status(400).json({ error: 'Geçersiz çalışma düzeni.', field: 'schedule' });
  }

  if (applyUrl && !isValidUrl(applyUrl) && !applyUrl.startsWith('mailto:')) {
    return res.status(400).json({ error: 'Geçersiz başvuru adresi (URL veya e-posta olmalıdır).', field: 'applyUrl' });
  }

  // Sanitization
  req.body.title = sanitizeText(title);
  if (company) req.body.company = sanitizeText(company);
  if (req.body.description) req.body.description = sanitizeText(req.body.description);
  if (req.body.contact) req.body.contact = sanitizeText(req.body.contact);

  next();
}

/**
 * Proje Giriş Doğrulama Middleware'i
 */
export function validateProject(req, res, next) {
  const { name, type, githubUrl, demoUrl, imageUrl } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Proje adı zorunludur.', field: 'name' });
  }

  if (name.length > 200) {
    return res.status(400).json({ error: 'Proje adı en fazla 200 karakter olabilir.', field: 'name' });
  }

  if (type && !['showcase', 'seeking_team', 'opensource'].includes(type)) {
    return res.status(400).json({ error: 'Geçersiz proje kategorisi.', field: 'type' });
  }

  if (githubUrl && !isValidUrl(githubUrl)) {
    return res.status(400).json({ error: 'Geçersiz GitHub bağlantısı.', field: 'githubUrl' });
  }

  if (demoUrl && !isValidUrl(demoUrl)) {
    return res.status(400).json({ error: 'Geçersiz canlı demo bağlantısı.', field: 'demoUrl' });
  }

  if (imageUrl && !isValidUrl(imageUrl)) {
    return res.status(400).json({ error: 'Geçersiz görsel URL bağlantısı.', field: 'imageUrl' });
  }

  // Sanitization
  req.body.name = sanitizeText(name);
  if (req.body.description) req.body.description = sanitizeText(req.body.description);
  if (req.body.owner) req.body.owner = sanitizeText(req.body.owner);

  next();
}

/**
 * Etkinlik Türü Doğrulama Middleware'i
 */
export function validateEventType(req, res, next) {
  const { id, label, icon, colorModern, colorPixel } = req.body || {};

  if (!id || typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({ error: 'Etkinlik türü ID zorunludur.', field: 'id' });
  }

  if (!label || typeof label !== 'string' || !label.trim()) {
    return res.status(400).json({ error: 'Etkinlik türü etiketi zorunludur.', field: 'label' });
  }

  if (colorModern && !isValidHexColor(colorModern)) {
    return res.status(400).json({ error: 'Geçersiz modern tema rengi (Örnek: #FF6600).', field: 'colorModern' });
  }

  if (colorPixel && !isValidHexColor(colorPixel)) {
    return res.status(400).json({ error: 'Geçersiz piksel tema rengi (Örnek: #EE6C19).', field: 'colorPixel' });
  }

  req.body.id = id.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_').slice(0, 40);
  req.body.label = sanitizeText(label).slice(0, 50);
  if (icon) req.body.icon = sanitizeText(icon).slice(0, 10);

  next();
}

/**
 * Topluluk Bağlantıları Doğrulama Middleware'i
 */
export function validateCommunityLinks(req, res, next) {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'İstek gövdesi geçerli bir obje olmalıdır.' });
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.trim()) {
      if (!isValidUrl(value.trim())) {
        return res.status(400).json({
          error: `"${key}" için geçersiz URL adresi: ${value}`,
          field: key,
        });
      }
    }
  }

  next();
}

/**
 * Sponsor Doğrulama Middleware'i
 */
export function validateSponsor(req, res, next) {
  const { name, logoUrl, websiteUrl, sortOrder, isActive } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Sponsor adı zorunludur.', field: 'name' });
  }

  if (name.length > 200) {
    return res.status(400).json({ error: 'Sponsor adı en fazla 200 karakter olabilir.', field: 'name' });
  }

  if (!logoUrl || !isValidUrl(logoUrl)) {
    return res.status(400).json({ error: 'Geçerli bir logo bağlantısı (URL) zorunludur.', field: 'logoUrl' });
  }

  if (!websiteUrl || !isValidUrl(websiteUrl)) {
    return res.status(400).json({ error: 'Geçerli bir web sitesi bağlantısı (URL) zorunludur.', field: 'websiteUrl' });
  }

  if (sortOrder !== undefined && (isNaN(Number(sortOrder)) || Number(sortOrder) < 0 || Number(sortOrder) > 10000)) {
    return res.status(400).json({ error: 'Sıralama değeri 0 ile 10000 arasında bir sayı olmalıdır.', field: 'sortOrder' });
  }

  // Sanitization
  req.body.name = sanitizeText(name);
  req.body.logoUrl = logoUrl.trim();
  req.body.websiteUrl = websiteUrl.trim();
  if (sortOrder !== undefined) req.body.sortOrder = Number(sortOrder);
  if (isActive !== undefined) req.body.isActive = Boolean(isActive) ? 1 : 0;

  next();
}

