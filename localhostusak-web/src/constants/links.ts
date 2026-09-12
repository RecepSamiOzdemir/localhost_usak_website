/**
 * Topluluk & WhatsApp Bağlantıları Konfigürasyonu
 * 
 * Bu dosya, tüm web sitesinde kullanılan WhatsApp grup bağlantıları
 * ve sosyal medya hesaplarının merkezi kaynağıdır.
 * 
 * Buradaki değerler varsayılan (fallback) olup, Admin paneli üzerinden
 * dinamik olarak güncellenebilir ve SQLite veritabanında saklanır.
 */

export interface CommunityLinks {
  // WhatsApp Grupları
  whatsappGeneral: string;
  whatsappProjects: string;
  whatsappCareers: string;
  whatsappCoworking: string;

  // Sosyal Medya & Topluluk Depoları
  instagram: string;
  github: string;
  x: string;
}

export const DEFAULT_COMMUNITY_LINKS: CommunityLinks = {
  whatsappGeneral: 'https://chat.whatsapp.com/',
  whatsappProjects: 'https://chat.whatsapp.com/dummy-projeler',
  whatsappCareers: 'https://chat.whatsapp.com/dummy-kariyer',
  whatsappCoworking: 'https://chat.whatsapp.com/dummy-coworking',
  instagram: 'https://instagram.com/localhostusak',
  github: 'https://github.com/localhostusak',
  x: 'https://x.com/localhostusak',
};

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
    icon: '💬',
    badge: 'Ana Grup',
    description: 'Tüm duyuruların, tanışmaların ve genel sohbetin döndüğü ana topluluk grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappProjects',
    label: 'Projeler WhatsApp Grubu',
    category: 'whatsapp',
    icon: '🚀',
    badge: 'Açık Kaynak & Üretim',
    description: 'Açık kaynak projeler, takım kurma, fikir ve repo geliştirme grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappCareers',
    label: 'Kariyer & İlanlar WhatsApp Grubu',
    category: 'whatsapp',
    icon: '💼',
    badge: 'İş & Staj',
    description: 'İş fırsatları, staj ilanları, freelance iş birlikleri ve mentörlük kanalı.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'whatsappCoworking',
    label: 'Coworking & Etkinlikler Grubu',
    category: 'whatsapp',
    icon: '☕',
    badge: 'Fiziksel Buluşmalar',
    description: 'Uşak kafe buluşmaları, coworking masası, atölye ve sunum organizasyon grubu.',
    placeholder: 'https://chat.whatsapp.com/...',
  },
  {
    key: 'instagram',
    label: 'Instagram (@localhostusak)',
    category: 'social',
    icon: '📷',
    badge: 'Sosyal Medya',
    description: 'Buluşma fotoğrafları, reels özetleri ve hikayeler.',
    placeholder: 'https://instagram.com/...',
  },
  {
    key: 'github',
    label: 'GitHub Deposu / Organizasyonu',
    category: 'social',
    icon: '🐙',
    badge: 'Açık Kaynak',
    description: 'Web sitesi kodu, açık kaynak projeler ve topluluk repoları.',
    placeholder: 'https://github.com/...',
  },
  {
    key: 'x',
    label: 'X / Twitter Hesabı',
    category: 'social',
    icon: '🐦',
    badge: 'Haber & Duyuru',
    description: 'Canlı teknoloji paylaşımları ve etkinlik duyuruları.',
    placeholder: 'https://x.com/...',
  },
];
