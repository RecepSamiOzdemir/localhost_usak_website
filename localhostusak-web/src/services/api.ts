import { EventItem, EventType } from '../types/event';
import { CareerItem } from '../types/career';
import { ProjectItem } from '../types/project';
import { SponsorItem } from '../types/sponsor';
import { CommunityLinks } from '../constants/links';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function normalizeMediaUrl(media: any, fallbackUrl?: string): string {
  if (!media) return fallbackUrl || '';
  if (typeof media === 'string') return media;
  if (media.url) {
    return media.url;
  }
  return fallbackUrl || '';
}

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API_BASE}/events?limit=100&sort=-dateStart`);
  if (!res.ok) throw new Error('Events could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.map((doc: any) => ({
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
    capacity: doc.capacity,
    attendees: doc.attendees || 0,
    imageUrl: normalizeMediaUrl(doc.coverImage, doc.imageUrl),
    whatsappLink: doc.whatsappLink,
    tags: Array.isArray(doc.tags) ? doc.tags.map((t: any) => (typeof t === 'string' ? t : t.tag || t.name)) : [],
    createdAt: doc.createdAt || new Date().toISOString(),
  }));
}

export async function fetchEventTypes(): Promise<EventType[]> {
  const res = await fetch(`${API_BASE}/event-types?limit=50&sort=sortOrder`);
  if (!res.ok) throw new Error('Event types could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.map((doc: any) => ({
    id: doc.slug || String(doc.id),
    label: doc.label,
    icon: doc.icon || '☕',
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

  return docs.map((doc: any) => ({
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

export async function fetchSponsors(): Promise<SponsorItem[]> {
  const res = await fetch(`${API_BASE}/sponsors?limit=100&where[isActive][equals]=true&sort=sortOrder`);
  if (!res.ok) throw new Error('Sponsors could not be fetched');
  const data = await res.json();
  const docs = Array.isArray(data) ? data : data.docs || [];

  return docs.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    logoUrl: normalizeMediaUrl(doc.logo, doc.logoUrl),
    websiteUrl: doc.websiteUrl,
    sortOrder: doc.sortOrder || 0,
    isActive: doc.isActive !== false,
  }));
}

export async function fetchCommunityLinks(): Promise<Partial<CommunityLinks> | null> {
  try {
    const res = await fetch(`${API_BASE}/community-links?limit=50&where[isActive][equals]=true`);
    if (!res.ok) return null;
    const data = await res.json();
    const docs = Array.isArray(data) ? data : data.docs || [];

    const linkMap: Record<string, string> = {};
    for (const doc of docs) {
      if (doc.key && doc.url) {
        linkMap[doc.key] = doc.url;
      }
    }
    return linkMap as Partial<CommunityLinks>;
  } catch {
    return null;
  }
}
