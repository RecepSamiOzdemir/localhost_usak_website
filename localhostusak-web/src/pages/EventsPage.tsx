import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { EventSpotlightCard } from '../components/events/EventSpotlightCard';
import { EventStats } from '../components/events/EventStats';
import { EmptyState } from '../components/shared/EmptyState';
import { EventItem, EventType } from '../types/event';
import { useLinks } from '../context/LinksContext';

import { fetchEvents, fetchEventTypes, fetchEventsPageSettings, getCachedEventsPageSettings, EventsPageSettingsData } from '../services/api';
import seoPages from '../seo/pages.json';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCmsCollection } from '../hooks/useCmsCollection';
import { isUpcomingGroup } from '../utils/eventStatus';

export const EventsPage: React.FC = () => {
  const { links } = useLinks();
  const { items: events, isLoading, error, retry } = useCmsCollection<EventItem>(fetchEvents);
  const { items: eventTypes } = useCmsCollection<EventType>(fetchEventTypes);
  const [settings, setSettings] = useState<EventsPageSettingsData | null>(getCachedEventsPageSettings);

  // SEO Meta
  usePageMeta({
    title: settings?.meta?.title || seoPages["/etkinlikler"].title,
    description: settings?.meta?.description || seoPages["/etkinlikler"].description,
  });

  useEffect(() => {
    fetchEventsPageSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {
        // Fallback to static defaults
      });
  }, []);

  const typeMap = useMemo(() => {
    const map = new Map<string, EventType>();
    eventTypes.forEach((t) => map.set(t.id, t));
    return map;
  }, [eventTypes]);

  // Sayfada sadece gelecek etkinlikler gösterilir: yaklaşan grup (upcoming/open/closed)
  // + tarihi henüz gelmemiş iptal edilmiş etkinlikler. En yakın tarih en üstte.
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(
        (e) =>
          isUpcomingGroup(e, now) ||
          (e.status === 'cancelled' && new Date(e.dateStart).getTime() >= now.getTime())
      )
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, [events]);

  // Geri sayım iptal edilmemiş tüm yaklaşan etkinlik kartlarında gösterilir.
  const countdownEventIds = useMemo(
    () => new Set(upcomingEvents.filter((e) => e.status !== 'cancelled').map((e) => e.id)),
    [upcomingEvents]
  );

  return (
    <main>
      <PageHero
        tag={settings?.hero?.tag || "// ETKİNLİK TAKVİMİ & COWORKING"}
        title={settings?.hero?.title || "Cowork'ten Workshop'a,"}
        highlightText={settings?.hero?.highlightText || "Tüm Buluşmalar"}
        description={settings?.hero?.description || "Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak'ta aynı masada."}
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Event List Section */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Coworking ve Buluşmalar <span style={{ color: 'var(--accent-primary)' }}>({upcomingEvents.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <EmptyState
            icon={<Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--text-muted)' }} />}
            title="Etkinlikler Yükleniyor"
            description="Güncel etkinlikler getiriliyor."
          />
        ) : error ? (
          <EmptyState
            icon={<AlertTriangle size={40} style={{ color: '#FF6600' }} />}
            title="Etkinliklere Ulaşılamadı"
            description="İçerik şu anda yüklenemiyor. Biraz sonra tekrar deneyebilirsin."
            actionText="Tekrar Dene"
            onAction={retry}
          />
        ) : upcomingEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar size={40} style={{ color: 'var(--text-muted)' }} />}
            title="Yeni Buluşmalar Yakında"
            description={
              links.instagram
                ? 'Yeni buluşmalar yakında duyurulacak. Duyurulardan haberdar olmak için Instagram\'ı takip edebilirsin.'
                : 'Yeni buluşmalar yakında duyurulacak.'
            }
            actionText={links.instagram ? 'Instagram\'da Takip Et' : undefined}
            onAction={links.instagram ? () => window.open(links.instagram, '_blank', 'noopener,noreferrer') : undefined}
          />
        ) : (
          <div>
            {upcomingEvents.map((ev) => (
              <EventSpotlightCard
                key={ev.id}
                event={ev}
                eventType={typeMap.get(ev.typeId)}
                showCountdown={countdownEventIds.has(ev.id)}
              />
            ))}
          </div>
        )}

        {/* Event Statistics Banner */}
        {!isLoading && !error && events.length > 0 && <EventStats totalEvents={events.length} />}
      </div>
    </main>
  );
};
