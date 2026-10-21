/**
 * Topluluk & WhatsApp Bağlantıları Konfigürasyonu
 * 
 * Bu dosya, tüm web sitesinde kullanılan WhatsApp grup bağlantıları
 * ve sosyal medya hesaplarının merkezi kaynağıdır.
 * 
 * Bağlantılar Payload CMS tarafından sağlanır. Boş değerler gösterilmez.
 */

export interface CommunityLinks {
  // WhatsApp Grupları (camelCase)
  whatsappGeneral: string;
  whatsappProjects: string;
  whatsappCareers: string;
  whatsappCoworking: string;

  // Sosyal Medya & Topluluk Depoları
  instagram: string;
  github: string;
  x: string;

  // Snake_case destekli takma adlar (Payload CMS ve dinamik erişim için)
  whatsapp_general?: string;
  whatsapp_projects?: string;
  whatsapp_careers?: string;
  whatsapp_coworking?: string;
}

export const DEFAULT_COMMUNITY_LINKS: CommunityLinks = {
  whatsappGeneral: 'https://chat.whatsapp.com/I8eMGS58Gtz3dSn9J2mINa',
  whatsappProjects: '',
  whatsappCareers: '',
  whatsappCoworking: '',
  instagram: '',
  github: '',
  x: '',
};

export const COMMUNITY_KEY_MAP: Record<string, keyof CommunityLinks> = {
  // WhatsApp Grupları
  whatsapp_general: 'whatsappGeneral',
  whatsappgeneral: 'whatsappGeneral',
  whatsappGeneral: 'whatsappGeneral',
  whatsapp_projects: 'whatsappProjects',
  whatsappprojects: 'whatsappProjects',
  whatsappProjects: 'whatsappProjects',
  whatsapp_careers: 'whatsappCareers',
  whatsappcareers: 'whatsappCareers',
  whatsappCareers: 'whatsappCareers',
  whatsapp_coworking: 'whatsappCoworking',
  whatsappcoworking: 'whatsappCoworking',
  whatsappCoworking: 'whatsappCoworking',
  whatsapp_cowork: 'whatsappCoworking',
  whatsappcowork: 'whatsappCoworking',

  // Sosyal Medya & Depolar
  instagram: 'instagram',
  github: 'github',
  x: 'x',
  twitter: 'x',
};

export function normalizeCommunityLinkKey(rawKey: string): keyof CommunityLinks | null {
  if (!rawKey) return null;
  const direct = COMMUNITY_KEY_MAP[rawKey] || COMMUNITY_KEY_MAP[rawKey.toLowerCase()];
  if (direct) return direct;

  const camel = rawKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) as keyof CommunityLinks;
  if (camel in DEFAULT_COMMUNITY_LINKS) return camel;

  return null;
}


export interface LinkMetaItem {
  key: keyof CommunityLinks;
  label: string;
  category: 'whatsapp' | 'social';
  icon: string;
  badge: string;
  description: string;
  placeholder: string;
}

export const COMMUNITY_LINKS_META: LinkMetaItem[] = [
  {
    key: 'whatsappGeneral',
    label: 'Genel WhatsApp Topluluğu',
    category: 'whatsapp',
    icon: 'message-circle',
    badge: 'Ana Grup',
    description: 'Tüm duyuruların, tanışmaların ve genel sohbetin döndüğü ana topluluk grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappProjects',
    label: 'Projeler WhatsApp Grubu',
    category: 'whatsapp',
    icon: 'rocket',
    badge: 'Açık Kaynak & Üretim',
    description: 'Açık kaynak projeler, takım kurma, fikir ve repo geliştirme grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappCareers',
    label: 'Kariyer & İlanlar WhatsApp Grubu',
    category: 'whatsapp',
    icon: 'briefcase',
    badge: 'İş & Staj',
    description: 'İş fırsatları, staj ilanları, freelance iş birlikleri ve mentörlük kanalı.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappCoworking',
    label: 'Coworking & Etkinlikler Grubu',
    category: 'whatsapp',
    icon: 'coffee',
    badge: 'Fiziksel Buluşmalar',
    description: 'Uşak kafe buluşmaları, coworking masası, atölye ve sunum organizasyon grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'instagram',
    label: 'Instagram (@localhostusak)',
    category: 'social',
    icon: 'instagram',
    badge: 'Sosyal Medya',
    description: 'Buluşma fotoğrafları, reels özetleri ve hikayeler.',
    placeholder: 'https://instagram.com/...',
  },
  {
    key: 'github',
    label: 'GitHub Deposu / Organizasyonu',
    category: 'social',
    icon: 'github',
    badge: 'Açık Kaynak',
    description: 'Web sitesi kodu, açık kaynak projeler ve topluluk repoları.',
    placeholder: 'https://github.com/...',
  },
  {
    key: 'x',
    label: 'X / Twitter Hesabı',
    category: 'social',
    icon: 'x',
    badge: 'Haber & Duyuru',
    description: 'Canlı teknoloji paylaşımları ve etkinlik duyuruları.',
    placeholder: 'https://x.com/...',
  },
];
