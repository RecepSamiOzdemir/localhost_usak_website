import { EventItem } from '../types/event';

export type EventDisplayStatus = 'cancelled' | 'completed' | 'upcoming' | 'open' | 'closed';

export interface EventDisplayInfo {
  displayStatus: EventDisplayStatus;
  label: string;
  isPast: boolean;
  canRegister: boolean;
}

const STATUS_LABELS: Record<EventDisplayStatus, string> = {
  cancelled: 'İPTAL EDİLDİ',
  completed: 'TAMAMLANDI',
  upcoming: 'YAKLAŞAN',
  open: 'KAYITLAR AÇIK',
  closed: 'KAYIT KAPANDI',
};

// Tüm etkinlik kartlarının (EventCard, EventSpotlightCard, EventsPage, home/EventSpotlight)
// ortak öncelik mantığı: iptal > tarih geçmişse tamamlandı > CMS statüsü.
export function getEventDisplayStatus(event: EventItem, now: Date = new Date()): EventDisplayInfo {
  if (event.status === 'cancelled') {
    return { displayStatus: 'cancelled', label: STATUS_LABELS.cancelled, isPast: false, canRegister: false };
  }

  // Admin elle "tamamlandı" işaretlediyse tarihten bağımsız TAMAMLANDI gösterilir.
  if (event.status === 'completed') {
    return { displayStatus: 'completed', label: STATUS_LABELS.completed, isPast: true, canRegister: false };
  }

  const isPast = new Date(event.dateStart).getTime() < now.getTime();
  if (isPast) {
    return { displayStatus: 'completed', label: STATUS_LABELS.completed, isPast: true, canRegister: false };
  }

  const displayStatus = event.status; // 'upcoming' | 'open' | 'closed'
  return {
    displayStatus,
    label: STATUS_LABELS[displayStatus],
    isPast: false,
    canRegister: displayStatus === 'upcoming' || displayStatus === 'open',
  };
}

// Spotlight seçimi, "Yaklaşan" filtresi ve grid sıralaması için ortak grup kontrolü:
// tarihi henüz gelmemiş VE statüsü upcoming/open/closed olan etkinlikler.
export function isUpcomingGroup(event: EventItem, now: Date = new Date()): boolean {
  const info = getEventDisplayStatus(event, now);
  return !info.isPast && (info.displayStatus === 'upcoming' || info.displayStatus === 'open' || info.displayStatus === 'closed');
}
