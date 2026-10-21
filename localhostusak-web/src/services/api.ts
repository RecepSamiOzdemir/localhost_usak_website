import { EventItem, EventType } from '../types/event';
import { CareerItem } from '../types/career';
import { ProjectItem } from '../types/project';
import { SponsorItem } from '../types/sponsor';
import { MOCK_SPONSORS } from '../data/mockSponsors';
import { isUpcomingGroup } from '../utils/eventStatus';
import { CommunityLinks, normalizeCommunityLinkKey } from '../constants/links';
import type { ApplicationFormSettings, SubmitResult } from '../types/application';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function configuredUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    return !(parsed.hostname === 'chat.whatsapp.com' && parsed.pathname === '/');
  } catch {
    return false;
  }
}

function absoluteMediaUrl(url: string): string {
  if (/^(https?|data):/i.test(url)) return url;
  return new URL(url, new URL(API_BASE, window.location.origin)).toString();
}

function normalizeMediaUrl(media: any, fallbackUrl?: string): string {
  if (!media) return fallbackUrl ? absoluteMediaUrl(fallbackUrl) : '';
  if (typeof media === 'string') return absoluteMediaUrl(media);
  if (media.url) {
    return absoluteMediaUrl(media.url);
  }
  return fallbackUrl ? absoluteMediaUrl(fallbackUrl) : '';
}

export function normalizeEventDoc(doc: any): EventItem {
  return {
    id: doc.id,
    title: doc.title,
    description: typeof doc.description === 'string' ? doc.description : (doc.description?.root?.children?.[0]?.children?.[0]?.text || ''),
    typeId: typeof doc.type === 'object' && doc.type ? (doc.type.slug || doc.type.id) : (doc.type || 'cowork'),
    type: typeof doc.type === 'object' && doc.type ? {
      id: doc.type.slug || doc.type.id,
      label: doc.type.label,
      icon: doc.type.icon,
      colorModern: doc.type.colorModern,
      colorPixel: doc.type.colorPixel,
    } : undefined,
    status: doc.status || 'upcoming',
    dateStart: doc.dateStart,
    dateEnd: doc.dateEnd,
    location: doc.location || '',
    mapUrl: doc.mapUrl,
    imageUrl: normalizeMediaUrl(doc.coverImage, doc.imageUrl),
    whatsappLink: configuredUrl(doc.whatsappLink) ? doc.whatsappLink : undefined,
    recapUrl: configuredUrl(doc.recapUrl) ? doc.recapUrl : undefined,
    tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => (typeof t === 'string' ? t : t.tag || t.name)) : [],
    createdAt: doc.createdAt || new Date().toISOString(),
  };
}

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE}/events?limit=100`);
  if (!res.ok) throw new Error('Events could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  const items = docs.map(normalizeEventDoc);

  // Sıralama mantığı:
  // 1. Önce "yaklaşan grup" (upcoming/open/closed, tarihi gelmemiş), tarihi EN YAKIN olan en başta (ASC)
  // 2. Ardından geri kalanlar (tamamlanan/iptal/tarihi geçmiş), EN SON yapılan en başta (DESC)
  return items.sort((a: EventItem, b: EventItem) => {
    const aUpcoming = isUpcomingGroup(a);
    const bUpcoming = isUpcomingGroup(b);
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    const timeA = new Date(a.dateStart).getTime();
    const timeB = new Date(b.dateStart).getTime();

    if (aUpcoming && bUpcoming) {
      return timeA - timeB; // En yakın tarih ilk sırada
    }
    return timeB - timeA; // Geçmişte en son yapılan ilk sırada
  });
}

export async function fetchNextUpcomingEvent(): Promise<EventItem | null> {
  try {
    const res = await fetch(`${API_BASE}/events?where[status][equals]=upcoming&sort=dateStart&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    const docs = Array.isArray(data) ? data : data.docs || [];
    if (docs.length === 0) return null;
    return normalizeEventDoc(docs[0]);
  } catch {
    return null;
  }
}

export async function fetchEventTypes(): Promise<EventType[]> {
  const res = await fetch(`${API_BASE}/event-types?limit=50&sort=sortOrder`);
  if (!res.ok) throw new Error('Event types could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.map((doc: any) => ({
    id: doc.slug || String(doc.id),
    label: doc.label,
    icon: doc.icon || 'coffee',
    colorModern: doc.colorModern || '#FF6600',
    colorPixel: doc.colorPixel || '#EE6C19',
    isDefault: doc.isDefault,
    sortOrder: doc.sortOrder || 0,
  }));
}

export async function fetchCareers(): Promise<CareerItem[]> {
  const res = await fetch(`${API_BASE}/careers?limit=100&where[isActive][equals]=true`);
  if (!res.ok) throw new Error('Careers could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.filter((doc: any) => !doc.expiresAt || new Date(doc.expiresAt).getTime() >= Date.now()).map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    company: doc.company,
    type: doc.type || 'job',
    workMode: doc.workMode || 'remote',
    schedule: doc.schedule || 'fulltime',
    description: typeof doc.description === 'string' ? doc.description : (doc.description?.root?.children?.[0]?.children?.[0]?.text || ''),
    technologies: Array.isArray(doc.technologies) ? doc.technologies.map((t: any) => (typeof t === 'string' ? t : t.name)) : [],
    applyUrl: doc.applyUrl,
    contact: doc.contact,
    postedBy: doc.postedBy || '',
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || new Date().toISOString(),
    expiresAt: doc.expiresAt,
  }));
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const res = await fetch(`${API_BASE}/projects?limit=100&where[isActive][equals]=true`);
  if (!res.ok) throw new Error('Projects could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    description: doc.description || '',
    type: doc.type || 'showcase',
    technologies: Array.isArray(doc.technologies) ? doc.technologies.map((t: any) => (typeof t === 'string' ? t : t.name)) : [],
    owner: doc.owner || '',
    teamSize: doc.teamSize || 1,
    teamMax: doc.teamMax,
    rolesNeeded: Array.isArray(doc.rolesNeeded) ? doc.rolesNeeded.map((r: any) => (typeof r === 'string' ? r : r.role)) : [],
    githubUrl: doc.githubUrl,
    // FAZ5: açık kaynak projeleri için ek alanlar (hepsi opsiyonel)
    contributingGuideUrl: configuredUrl(doc.contributingGuideUrl) ? doc.contributingGuideUrl : undefined,
    projectStatus: doc.projectStatus || undefined,
    difficultyLevel: doc.difficultyLevel || undefined,
    demoUrl: doc.demoUrl,
    imageUrl: normalizeMediaUrl(doc.coverImage, doc.imageUrl),
    likes: doc.likes || 0,
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt,
  }));
}

export async function likeProject(id: number | string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/projects/${id}/like`, {
      method: 'PATCH',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.likes ?? null;
  } catch {
    return null;
  }
}

// Sponsor listesi için modül önbelleği: sayfalar arası geçişte tekrar istek/spinner olmasın
const SPONSORS_CACHE_TTL_MS = 5 * 60 * 1000;
let sponsorsCache: { items: SponsorItem[]; at: number } | null = null;
let sponsorsRequest: Promise<SponsorItem[]> | null = null;

// Geçerli önbellek varsa senkron döner (ilk render'da skeleton'u atlamak için)
export function getCachedSponsors(): SponsorItem[] | undefined {
  if (sponsorsCache && Date.now() - sponsorsCache.at < SPONSORS_CACHE_TTL_MS) {
    return sponsorsCache.items;
  }
  return undefined;
}

export function fetchSponsors(): Promise<SponsorItem[]> {
  const cached = getCachedSponsors();
  if (cached) return Promise.resolve(cached);
  // Aynı anda gelen çağrılar (anasayfa + sponsor sayfası) tek isteği paylaşır
  if (!sponsorsRequest) {
    sponsorsRequest = loadSponsors().finally(() => {
      sponsorsRequest = null;
    });
  }
  return sponsorsRequest;
}

async function loadSponsors(): Promise<SponsorItem[]> {
  try {
    const res = await fetch(`${API_BASE}/sponsors?limit=100&where[isActive][equals]=true&sort=sortOrder`);
    if (!res.ok) return MOCK_SPONSORS;
    const data = await res.json();
    const docs = Array.isArray(data) ? data : data.docs || [];

    if (docs.length === 0) {
      return MOCK_SPONSORS;
    }

    const items: SponsorItem[] = docs.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      tier: doc.tier || 'community',
      logoUrl: normalizeMediaUrl(doc.logo, doc.logoUrl),
      websiteUrl: doc.websiteUrl,
      sortOrder: doc.sortOrder || 0,
      isActive: doc.isActive !== false,
    }));
    // Sadece gerçek API yanıtı önbelleğe alınır; mock yedekler alınmaz (hata sonrası düzelme şansı kalsın)
    sponsorsCache = { items, at: Date.now() };
    return items;
  } catch {
    return MOCK_SPONSORS;
  }
}

export async function fetchCommunityLinks(): Promise<Partial<CommunityLinks> | null> {
  try {
    const res = await fetch(`${API_BASE}/community-links?limit=50&where[isActive][equals]=true`);
    if (!res.ok) return null;
    const data = await res.json();
    const docs = Array.isArray(data) ? data : data.docs || [];

    const linkMap: Partial<CommunityLinks> & Record<string, string> = {};
    for (const doc of docs) {
      if (doc.key && configuredUrl(doc.url)) {
        const normalizedKey = normalizeCommunityLinkKey(doc.key);
        if (normalizedKey) {
          linkMap[normalizedKey] = doc.url;
        }
        linkMap[doc.key] = doc.url;
      }
    }
    return linkMap;
  } catch {
    return null;
  }
}

export interface SiteHeroSettings {
  cityCoordinates?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  description?: string;
}

export interface SiteStatItem {
  target: number;
  prefix: string;
  suffix: string;
  label: string;
}

export interface SiteValueItem {
  icon: string;
  title: string;
  description: string;
  tags?: string;
}

export interface SitePersonaItem {
  icon: string;
  title: string;
  description: string;
  tags?: string;
}

export interface SiteFlowStep {
  num: string;
  title: string;
  desc: string;
}

export interface SiteCareerResource {
  icon: string;
  title: string;
  desc: string;
  tag?: string;
}

export interface SiteVisionMessageItem {
  id?: string;
  quote: string;
  tag?: string;
  author?: string;
}

export interface SiteSettingsData {
  hero?: SiteHeroSettings;
  visionMessages?: SiteVisionMessageItem[];
  stats?: SiteStatItem[];
  values?: SiteValueItem[];
  personas?: SitePersonaItem[];
  flowSteps?: SiteFlowStep[];
  careerResources?: SiteCareerResource[];
}

export async function fetchSiteSettings(): Promise<SiteSettingsData | null> {
  try {
    const res = await fetch(`${API_BASE}/globals/site-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as SiteSettingsData;
  } catch {
    return null;
  }
}

// --- Genel Site & SEO Ayarları ---
export interface GeneralSettingsData {
  meta?: {
    siteTitle?: string;
    defaultDescription?: string;
    keywords?: string;
    ogImage?: any;
  };
  header?: {
    announcementActive?: boolean;
    announcementText?: string;
    announcementUrl?: string;
  };
  footer?: {
    tagline?: string;
    locationCoordinates?: string;
    copyrightText?: string;
  };
}

export async function fetchGeneralSettings(): Promise<GeneralSettingsData | null> {
  try {
    const res = await fetch(`${API_BASE}/globals/general-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as GeneralSettingsData;
  } catch {
    return null;
  }
}

// --- Etkinlikler Sayfası Ayarları ---
export interface EventsPageSettingsData {
  hero?: {
    tag?: string;
    title?: string;
    highlightText?: string;
    description?: string;
  };
  whatsappCta?: {
    buttonText?: string;
    overrideUrl?: string;
  };
  meta?: {
    title?: string;
    description?: string;
  };
}

let eventsPageSettingsCache: EventsPageSettingsData | null = null;

export function getCachedEventsPageSettings(): EventsPageSettingsData | null {
  return eventsPageSettingsCache;
}

export async function fetchEventsPageSettings(): Promise<EventsPageSettingsData | null> {
  if (eventsPageSettingsCache) return eventsPageSettingsCache;
  try {
    const res = await fetch(`${API_BASE}/globals/events-page-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    eventsPageSettingsCache = data as EventsPageSettingsData;
    return eventsPageSettingsCache;
  } catch {
    return null;
  }
}

// --- Kariyer Sayfası Ayarları ---
export interface CareersPageSettingsData {
  hero?: {
    tag?: string;
    title?: string;
    highlightText?: string;
    description?: string;
  };
  whatsappCta?: {
    buttonText?: string;
    overrideUrl?: string;
  };
  careerResources?: SiteCareerResource[];
  meta?: {
    title?: string;
    description?: string;
  };
  applicationForm?: ApplicationFormSettings;
}

let careersPageSettingsCache: CareersPageSettingsData | null = null;

export function getCachedCareersPageSettings(): CareersPageSettingsData | null {
  return careersPageSettingsCache;
}

export async function fetchCareersPageSettings(): Promise<CareersPageSettingsData | null> {
  if (careersPageSettingsCache) return careersPageSettingsCache;
  try {
    const res = await fetch(`${API_BASE}/globals/careers-page-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    careersPageSettingsCache = data as CareersPageSettingsData;
    return careersPageSettingsCache;
  } catch {
    return null;
  }
}

// --- CV Havuzu Başvurusu (FAZ 6) ---

// Başvuru tarayıcıdan DOĞRUDAN CMS'e gider; frontend sunucusu/proxy üzerinden geçerse CMS tüm
// başvuruları tek IP'den görür ve günlük IP sınırı herkesi engeller. Production derlemesinde
// VITE_API_URL mutlak (https://cms…/api) olmalıdır; göreli ise form gösterilmez.
// (Geliştirmede göreli '/api' Vite proxy'sine gider; yalnızca yerel deneme içindir.)
export function isDirectCmsApi(): boolean {
  return !import.meta.env.PROD || /^https?:\/\//i.test(API_BASE);
}

const APPLY_TIMEOUT_MS = 60_000;
const NETWORK_ERROR_MESSAGE = 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.';
const UNEXPECTED_ERROR_MESSAGE = 'Başvurunuz şu anda gönderilemedi. Lütfen daha sonra tekrar deneyin.';

// FormData'nın Content-Type başlığı (multipart sınırı) tarayıcı tarafından konur; elle eklenmez.
// credentials: 'omit' — başvuru anonimdir, oturum çerezi gönderilmez.
export async function submitJobApplication(form: FormData): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), APPLY_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/job-applications/apply`, {
      method: 'POST',
      body: form,
      credentials: 'omit',
      signal: controller.signal,
    });
    if (res.ok) return { ok: true };

    // CMS hata gövdesi: { success:false, code, message, fields? }; mesaj olduğu gibi gösterilir
    let body: { message?: unknown; fields?: unknown } | null = null;
    try {
      body = await res.json();
    } catch {
      // JSON değil (ör. ters proxy hata sayfası)
    }
    const message = typeof body?.message === 'string' && body.message ? body.message : UNEXPECTED_ERROR_MESSAGE;
    const fields = Array.isArray(body?.fields) ? body.fields.filter((f): f is string => typeof f === 'string') : [];
    return { ok: false, message, fields };
  } catch {
    return { ok: false, message: NETWORK_ERROR_MESSAGE, fields: [] };
  } finally {
    clearTimeout(timer);
  }
}

// --- Projeler Sayfası Ayarları ---
export interface ProjectsPageSettingsData {
  hero?: {
    tag?: string;
    title?: string;
    highlightText?: string;
    description?: string;
  };
  whatsappCta?: {
    buttonText?: string;
    overrideUrl?: string;
  };
  meta?: {
    title?: string;
    description?: string;
  };
}

let projectsPageSettingsCache: ProjectsPageSettingsData | null = null;

export function getCachedProjectsPageSettings(): ProjectsPageSettingsData | null {
  return projectsPageSettingsCache;
}

export async function fetchProjectsPageSettings(): Promise<ProjectsPageSettingsData | null> {
  if (projectsPageSettingsCache) return projectsPageSettingsCache;
  try {
    const res = await fetch(`${API_BASE}/globals/projects-page-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    projectsPageSettingsCache = data as ProjectsPageSettingsData;
    return projectsPageSettingsCache;
  } catch {
    return null;
  }
}

// --- KVKK & Hukuki Ayarlar ---
export interface KvkkSectionData {
  id: string;
  num: string;
  title: string;
  content?: string;
}

export interface KvkkSettingsData {
  hero?: {
    tag?: string;
    title?: string;
    highlightText?: string;
    description?: string;
  };
  documentMeta?: {
    badgeText?: string;
    lastUpdated?: string;
    version?: string;
    contactEmail?: string;
  };
  leadText?: string;
  callouts?: {
    photoVideoTitle?: string;
    photoVideoText?: string;
    intellectualPropertyTitle?: string;
    intellectualPropertyText?: string;
  };
  consent?: {
    badge?: string;
    declarationText?: string;
    dateNote?: string;
    dataControllerName?: string;
  };
  sections?: KvkkSectionData[];
}

export async function fetchKvkkSettings(): Promise<KvkkSettingsData | null> {
  try {
    const res = await fetch(`${API_BASE}/globals/kvkk-settings`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as KvkkSettingsData;
  } catch {
    return null;
  }
}

// ─── Instagram ─────────────────────────────────────────────────────────────

export interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const url = `${base}/instagram/posts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Instagram fetch failed');
  const json = await res.json();
  return (json.posts ?? []) as InstagramPost[];
}
