import React, { useState, useEffect, useMemo } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { EventSpotlightCard } from '../components/events/EventSpotlightCard';
import { EventCard } from '../components/events/EventCard';
import { EventStats } from '../components/events/EventStats';
import { EmptyState } from '../components/shared/EmptyState';
import { EventItem, EventType } from '../types/event';

// Static fallbacks
import initialEvents from '../data/events.json';
import initialTypes from '../data/eventTypes.json';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(initialEvents as EventItem[]);
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialTypes as EventType[]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch from API with fallback
  useEffect(() => {
    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setEvents(data);
      })
      .catch(() => {
        // Fallback to static data
      });

    fetch('/api/event-types')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setEventTypes(data);
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

  // Spotlight event: First upcoming event
  const spotlightEvent = useMemo(() => {
    return events.find((e) => e.status === 'upcoming');
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
        whatsappUrl="https://chat.whatsapp.com/dummy-coworking"
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
