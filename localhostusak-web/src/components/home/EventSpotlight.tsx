import React, { useMemo } from 'react';
import { Calendar, MapPin, Coffee, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { CountdownTimer, WhatsAppIcon, EmptyState } from '../shared';
import { downloadICS, openGoogleCalendar } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { fetchEvents } from '../../services/api';
import { EventItem } from '../../types/event';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { getEventDisplayStatus, isUpcomingGroup } from '../../utils/eventStatus';
import { getMapHref } from '../../utils/mapLink';

export const EventSpotlight: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { items: events, isLoading, error, retry } = useCmsCollection<EventItem>(fetchEvents);

  // En yakın "yaklaşan grup" (upcoming/open/closed, tarihi gelmemiş) etkinliği seç:
  const upcomingEvent = useMemo(() => {
    const upcomingList = events
      .filter((e) => isUpcomingGroup(e))
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
    return upcomingList[0];
  }, [events]);

  const statusInfo = upcomingEvent ? getEventDisplayStatus(upcomingEvent) : null;

  if (isLoading || error || !upcomingEvent) {
    return (
      <section className="section" id="events" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <EmptyState
            icon={
              error ? (
                <AlertTriangle size={40} style={{ color: '#FF6600' }} />
              ) : isLoading ? (
                <Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--text-muted)' }} />
              ) : (
                <Calendar size={40} style={{ color: 'var(--text-muted)' }} />
              )
            }
            title={error ? 'Etkinliklere Ulaşılamadı' : isLoading ? 'Etkinlikler Yükleniyor' : 'Yeni Buluşmalar Yakında'}
            description={error ? 'Güncel etkinlikler şu anda yüklenemiyor.' : isLoading ? 'Güncel etkinlikler getiriliyor.' : 'Yaklaşan bir etkinlik duyurulduğunda burada paylaşacağız.'}
            actionText={error ? 'Tekrar Dene' : undefined}
            onAction={error ? retry : undefined}
          />
        </div>
      </section>
    );
  }

  const targetDate = upcomingEvent.dateStart;
  const meetupDate = new Date(targetDate);

  const formattedDate = !isNaN(meetupDate.getTime())
    ? meetupDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    : targetDate;

  const eventTitle = upcomingEvent.title;
  const eventDesc = upcomingEvent.description || 'Etkinlik ayrıntıları yakında paylaşılacak.';
  const eventLocation = upcomingEvent.location || 'Mekan yakında duyurulacak';
  const eventMapUrl = upcomingEvent.mapUrl;
  const mapHref = getMapHref(eventMapUrl, eventLocation);
  const eventTags = upcomingEvent.tags || [];

  const handleDownloadICS = () => {
    downloadICS({
      title: eventTitle,
      description: eventDesc,
      location: eventLocation,
      startDate: meetupDate,
      durationHours: 3,
    });
  };

  const handleGoogleCalendar = () => {
    openGoogleCalendar({
      title: eventTitle,
      description: eventDesc,
      location: eventLocation,
      startDate: meetupDate,
      durationHours: 3,
    });
  };

  return (
    <section className="section" id="events" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// BULUŞMA TAKVİMİ</span>
          <h2 className="section-title">Sıradaki Buluşma: {eventTitle.split(':')[0]}</h2>
          <p className="section-desc">
            Laptopunu hazırla, kahveni seç. Uşak'taki diğer geliştirici ve tasarımcılarla aynı masadayız.
          </p>
        </div>

        <div className="spotlight-card card circuit-border">
          {/* Corner HUD Markers (Modern) */}
          <span className="hud-corner-tl" aria-hidden="true" />
          <span className="hud-corner-tr" aria-hidden="true" />
          <span className="hud-corner-bl" aria-hidden="true" />
          <span className="hud-corner-br" aria-hidden="true" />

          <div className="spotlight-inner">
            {/* Left Info Block */}
            <div>
              <div className="spotlight-badges">
                <span className="badge badge-orange">
                  {upcomingEvent?.type?.label?.toUpperCase() || 'BULUŞMA'}
                </span>
                {statusInfo && (
                  <span className={`badge ${statusInfo.canRegister ? 'badge-live' : 'badge-orange'}`}>
                    {statusInfo.label}
                  </span>
                )}
                <span className="badge badge-blue">YÜZ YÜZE</span>
                <span className="badge badge-live">KATILIM ÜCRETSİZ</span>
              </div>

              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.75rem' }}>
                {eventTitle.includes(':') ? eventTitle.split(':')[1].trim() : eventTitle}
              </h3>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {eventDesc}
              </p>

              {/* Meetup Metadata List */}
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
                    <strong>Mekan:</strong> {eventLocation}
                  </div>
                </div>
                <div className="meetup-meta-item">
                  <span className="meta-icon"><Coffee size={18} /></span>
                  <div>
                    <strong>Format:</strong> Serbest Çalışma, Proje Paylaşımı, Tanışma & Sohbet
                  </div>
                </div>
              </div>

              {/* Agenda Tags */}
              <div className="agenda-tags">
                {eventTags.map((tag, idx) => (
                  <span key={idx} className="agenda-tag">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Countdown & Action Card */}
            <div className="spotlight-countdown-card">
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

              {/* Live Countdown Grid */}
              <CountdownTimer targetDate={targetDate} />

              <div
                style={{
                  marginTop: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  id="btn-add-calendar"
                  onClick={handleDownloadICS}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <span>Takvime Ekle (.ICS)</span>
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  id="btn-google-calendar"
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
                {statusInfo?.canRegister ? (
                  (links.whatsappCoworking || links.whatsappGeneral) && <a
                    href={links.whatsappCoworking || links.whatsappGeneral}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-full"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsAppWithRules(
                        links.whatsappCoworking || links.whatsappGeneral,
                        'Coworking & Buluşma Grubu'
                      );
                    }}
                  >
                    <WhatsAppIcon size={18} />
                    <span>WhatsApp Grubuna Katıl</span>
                  </a>
                ) : statusInfo?.displayStatus === 'cancelled' ? (
                  <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Etkinlik iptal edildi
                  </span>
                ) : statusInfo?.displayStatus === 'closed' ? (
                  <span style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Kontenjan doldu
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
