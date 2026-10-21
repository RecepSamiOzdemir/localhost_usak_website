import React from 'react';
import { Calendar, MapPin, Download } from 'lucide-react';
import { EventItem, EventType } from '../../types/event';
import { CountdownTimer, WhatsAppIcon } from '../shared';
import { downloadICS, openGoogleCalendar } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { getEventDisplayStatus } from '../../utils/eventStatus';
import { getMapHref } from '../../utils/mapLink';

interface EventSpotlightCardProps {
  event: EventItem;
  eventType?: EventType;
  /** Geri sayım bölümünü göster/gizle. Sadece listedeki en yakın (ilk iptal olmayan) etkinlikte true olmalı. */
  showCountdown?: boolean;
}

export const EventSpotlightCard: React.FC<EventSpotlightCardProps> = ({ event, eventType, showCountdown = true }) => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const statusInfo = getEventDisplayStatus(event);
  const startDate = new Date(event.dateStart);
  const mapHref = getMapHref(event.mapUrl, event.location);

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
      style={{ marginBottom: '3rem' }}
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
              {eventType?.label || event.typeId}
            </span>
            <span className={`badge ${statusInfo.canRegister ? 'badge-live' : 'badge-orange'}`}>
              {statusInfo.label}
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
              <span className="meta-icon"><Calendar size={18} /></span>
              <div>
                <strong>Tarih:</strong> {formattedDate}
              </div>
            </div>
            <div className="meetup-meta-item">
              <span className="meta-icon"><MapPin size={18} /></span>
              <div>
                <strong>Mekan:</strong> {event.location}
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

        <div className="spotlight-countdown-card">
          {showCountdown && (
            <>
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
                BULUŞMAYA KALAN SÜRE
              </div>

              <CountdownTimer targetDate={event.dateStart} />
            </>
          )}

          <div style={{ marginTop: showCountdown ? '1.75rem' : 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={handleDownloadICS}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <span>Takvime Ekle (.ICS)</span>
              <Download size={16} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={handleGoogleCalendar}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <span>Google Takvim'e Kaydet</span>
              <Calendar size={16} />
            </button>
            {mapHref && (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-full"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <span>Haritada Gör</span>
                <MapPin size={16} />
              </a>
            )}
            {statusInfo.canRegister ? (
              (event.whatsappLink || links.whatsappCoworking) && <a
                href={event.whatsappLink || links.whatsappCoworking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-full"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsAppWithRules(event.whatsappLink || links.whatsappCoworking, 'WhatsApp Coworking Masası');
                }}
              >
                <WhatsAppIcon size={18} />
                <span>WhatsApp Coworking Masasına Katıl</span>
              </a>
            ) : statusInfo.displayStatus === 'cancelled' ? (
              <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Etkinlik iptal edildi
              </span>
            ) : statusInfo.displayStatus === 'closed' ? (
              <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Kontenjan doldu
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
