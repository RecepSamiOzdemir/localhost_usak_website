import React, { useState, useEffect, useMemo } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { EventSpotlightCard } from '../components/events/EventSpotlightCard';
import { EventCard } from '../components/events/EventCard';
import { EventStats } from '../components/events/EventStats';
import { EmptyState } from '../components/shared/EmptyState';
import { EventItem, EventType } from '../types/event';
import { useLinks } from '../context/LinksContext';

import { fetchEvents, fetchEventTypes } from '../services/api';

// Static fallbacks
import initialEvents from '../data/events.json';
import initialTypes from '../data/eventTypes.json';

export const EventsPage: React.FC = () => {
  const { links } = useLinks();
  const [events, setEvents] = useState<EventItem[]>(initialEvents as EventItem[]);
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialTypes as EventType[]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch from API with fallback
  useEffect(() => {
    fetchEvents()
      .then((data) => {
        if (data && data.length > 0) setEvents(data);
      })
      .catch(() => {
        // Fallback to static data
      });

    fetchEventTypes()
      .then((data) => {
        if (data && data.length > 0) setEventTypes(data);
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  const typeMap = useMemo(() => {
    const map = new Map<string, EventType>();
    eventTypes.forEach((t) => map.set(t.id, t));
    return map;
  }, [eventTypes]);

  // Primary options
  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Tipler', icon: '⚡' },
    ...eventTypes.map((t) => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
    })),
  ];

  // Secondary options
  const secondaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Durumlar' },
    { id: 'upcoming', label: 'Yaklaşan' },
    { id: 'completed', label: 'Geçmiş' },
  ];

  // Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchType = selectedType === 'all' || e.typeId === selectedType;
      const matchStatus = selectedStatus === 'all' || e.status === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchStatus && matchSearch;
    });
  }, [events, selectedType, selectedStatus, searchQuery]);

  // Spotlight event: En yakın yaklaşan etkinlik (tarihe göre sıralı)
  const spotlightEvent = useMemo(() => {
    const upcoming = events
      .filter((e) => e.status === 'upcoming')
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
    return upcoming[0];
  }, [events]);

  const totalAttendees = useMemo(() => {
    return events.reduce((sum, e) => sum + (e.attendees || 0), 0);
  }, [events]);

  return (
    <main>
      <PageHero
        tag="// ETKİNLİK TAKVİMİ & COWORKING"
        title="Cowork'ten Workshop'a,"
        highlightText="Tüm Buluşmalar"
        description="Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak'ta aynı masada."
        whatsappUrl={links.whatsappCoworking}
        whatsappLabel="WhatsApp Coworking Grubuna Katıl"
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filter Bar */}
        <FilterBar
          primaryLabel="Tür"
          primaryOptions={primaryOptions}
          selectedPrimary={selectedType}
          onSelectPrimary={setSelectedType}
          secondaryLabel="Durum"
          secondaryOptions={secondaryOptions}
          selectedSecondary={selectedStatus}
          onSelectSecondary={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Etkinlik veya mekan ara..."
        />

        {/* Spotlight Event (if in 'all' or 'upcoming' filter and available) */}
        {selectedType === 'all' && selectedStatus !== 'completed' && searchQuery === '' && spotlightEvent && (
          <EventSpotlightCard event={spotlightEvent} eventType={typeMap.get(spotlightEvent.typeId)} />
        )}

        {/* Event List Section */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Tüm Buluşmalar <span style={{ color: 'var(--accent-primary)' }}>({filteredEvents.length})</span>
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Buluşma Bulunamadı"
            description="Seçtiğin kriterlere uygun etkinlik bulunmuyor. Filtreleri sıfırlayarak tüm etkinlikleri görebilirsin."
            actionText="Filtreleri Sıfırla"
            onAction={() => {
              setSelectedType('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid-3" style={{ gap: '1.75rem' }}>
            {filteredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} eventType={typeMap.get(ev.typeId)} />
            ))}
          </div>
        )}

        {/* Event Statistics Banner */}
        <EventStats totalEvents={events.length} totalAttendees={totalAttendees} />
      </div>
    </main>
  );
};
