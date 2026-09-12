import React from 'react';
import { EventItem, EventType } from '../../types/event';
import { CountdownTimer } from '../shared/CountdownTimer';
import { downloadICS, openGoogleCalendar } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';

interface EventSpotlightCardProps {
  event: EventItem;
  eventType?: EventType;
}

export const EventSpotlightCard: React.FC<EventSpotlightCardProps> = ({ event, eventType }) => {
  const { links } = useLinks();
  const startDate = new Date(event.dateStart);

  const formattedDate = startDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownloadICS = () => {
    downloadICS({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: startDate,
    });
  };

  const handleGoogleCalendar = () => {
    openGoogleCalendar({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: startDate,
    });
  };

  return (
    <div
      className="spotlight-card card circuit-border"
      style={{ padding: '3rem 2.5rem', position: 'relative', marginBottom: '3rem' }}
    >
      <span className="hud-corner-tl" aria-hidden="true" />
      <span className="hud-corner-tr" aria-hidden="true" />
      <span className="hud-corner-bl" aria-hidden="true" />
      <span className="hud-corner-br" aria-hidden="true" />

      <div className="spotlight-inner">
        <div>
          <div className="spotlight-badges">
            <span
              className="badge"
              style={{
                backgroundColor: eventType ? `${eventType.colorModern}22` : 'var(--bg-tag)',
                color: eventType ? eventType.colorModern : 'var(--accent-primary)',
                border: `1px solid ${eventType ? eventType.colorModern : 'var(--accent-primary)'}`,
              }}
            >
              {eventType?.icon} {eventType?.label || event.typeId}
            </span>
            <span className="badge badge-blue">YÜZ YÜZE</span>
            <span className="badge badge-live">KATILIM ÜCRETSİZ</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.85rem' }}>
            {event.title}
          </h2>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {event.description}
          </p>

          <div className="meetup-meta-list">
            <div className="meetup-meta-item">
              <span className="meta-icon">📅</span>
              <div>
                <strong>Tarih:</strong> {formattedDate}
              </div>
            </div>
            <div className="meetup-meta-item">
              <span className="meta-icon">📍</span>
              <div>
                <strong>Mekan:</strong> {event.location}
                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--accent-secondary)',
                      fontSize: '0.85rem',
                      marginLeft: '0.5rem',
                      textDecoration: 'underline',
                    }}
                  >
                    (Haritada Gör ↗)
                  </a>
                )}
              </div>
            </div>
            <div className="meetup-meta-item">
              <span className="meta-icon">👥</span>
              <div>
                <strong>Kontenjan & Katılım:</strong> {event.attendees} Kişi Masada (Kapasite: {event.capacity || 'Sınırsız'})
              </div>
            </div>
          </div>

          {event.tags && (
            <div className="agenda-tags">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="agenda-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: 'var(--surface-elevated)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-circuit)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            ⏳ BULUŞMAYA KALAN SÜRE
          </div>

          <CountdownTimer targetDate={event.dateStart} />

          <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={handleDownloadICS}
            >
              <span>Takvime Ekle (.ICS)</span>
              <span>📥</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={handleGoogleCalendar}
            >
              <span>Google Takvim'e Kaydet</span>
              <span>📅</span>
            </button>
            <a
              href={event.whatsappLink || links.whatsappCoworking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-full"
            >
              <span>WhatsApp Coworking Masasına Katıl</span>
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
