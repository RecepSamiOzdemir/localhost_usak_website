import React from 'react';
import { EventItem, EventType } from '../../types/event';
import { downloadICS } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';

interface EventCardProps {
  event: EventItem;
  eventType?: EventType;
}

export const EventCard: React.FC<EventCardProps> = ({ event, eventType }) => {
  const { links } = useLinks();
  const isUpcoming = event.status === 'upcoming';
  const startDate = new Date(event.dateStart);

  const formattedDate = startDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadICS({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: startDate,
    });
  };

  return (
    <article className="card event-card circuit-border">
      <div>
        <div className="event-card-header">
          <span
            className="event-card-type-tag"
            style={{
              backgroundColor: eventType ? `${eventType.colorModern}22` : 'rgba(255, 102, 0, 0.15)',
              color: eventType ? eventType.colorModern : 'var(--accent-primary)',
              border: `1px solid ${eventType ? eventType.colorModern : 'var(--accent-primary)'}`,
            }}
          >
            {eventType?.icon || '📅'} {eventType?.label || event.typeId}
          </span>

          <span className={`badge ${isUpcoming ? 'badge-live' : 'badge-orange'}`}>
            {isUpcoming ? 'YAKLAŞAN' : 'TAMAMLANDI'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.65rem' }}>
          {event.title}
        </h3>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {event.description}
        </p>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>

          <div className="event-card-meta-item">
            <span>📍</span>
            <span>{event.location}</span>
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-secondary)',
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                  marginLeft: '0.25rem',
                }}
              >
                (Harita)
              </a>
            )}
          </div>

          <div className="event-card-meta-item">
            <span>👥</span>
            <span>
              {event.attendees} Katılımcı {event.capacity ? `/ ${event.capacity} Kontenjan` : ''}
            </span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="agenda-tags" style={{ marginTop: '0.75rem' }}>
            {event.tags.map((tag, idx) => (
              <span key={idx} className="agenda-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="event-card-footer">
        {isUpcoming ? (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCalendar}
              title="Takvime Ekle (.ICS)"
            >
              <span>Takvime Ekle</span>
              <span>📥</span>
            </button>
            <a
              href={event.whatsappLink || links.whatsappCoworking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <span>Masada Yer Ayır</span>
              <span>💬</span>
            </a>
          </>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ✓ Etkinlik başarıyla tamamlandı
          </span>
        )}
      </div>
    </article>
  );
};
