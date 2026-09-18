import React, { useState, useEffect, useMemo } from 'react';
import { CountdownTimer } from '../shared/CountdownTimer';
import { downloadICS, openGoogleCalendar } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { fetchEvents } from '../../services/api';
import { EventItem } from '../../types/event';
import defaultEvents from '../../data/events.json';

export const EventSpotlight: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const [events, setEvents] = useState<EventItem[]>(defaultEvents as EventItem[]);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {
        // Fallback to defaultEvents
      });
  }, []);

  // En yakın yaklaşan (upcoming) etkinliği tarihe göre en yakından uzağa sıralayarak seç:
  const upcomingEvent = useMemo(() => {
    const upcomingList = events
      .filter((e) => e.status === 'upcoming')
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
    return upcomingList[0] || events[0];
  }, [events]);

  const targetDate = upcomingEvent?.dateStart || '2026-09-28T14:00:00';
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

  const eventTitle = upcomingEvent?.title || 'Buluşma #3: Kahve, Kod ve Gelecek Projeler';
  const eventDesc =
    upcomingEvent?.description ||
    "Uşak'ta teknolojiyle ilgilenen herkesin bir araya geldiği, projelerini anlattığı, takıldığı noktalarda birbirine destek olduğu ve keyifli bir kahve eşliğinde networking yaptığı 3. buluşmamız!";
  const eventLocation = upcomingEvent?.location || 'Coff The Story / Treehouse Cafe, Uşak';
  const eventMapUrl = upcomingEvent?.mapUrl || 'https://maps.google.com/?q=Uşak+Coff+The+Story';
  const eventTags =
    upcomingEvent?.tags && upcomingEvent.tags.length > 0
      ? upcomingEvent.tags
      : ['#WebDev', '#AI_Agents', '#UI_UX', '#MobileDev', '#Freelance', '#CoffeeAndCode'];

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

        <div
          className="spotlight-card card circuit-border"
          style={{ padding: '3rem 2.5rem', position: 'relative' }}
        >
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
                  <span className="meta-icon">📅</span>
                  <div>
                    <strong>Tarih:</strong> {formattedDate}
                  </div>
                </div>
                <div className="meetup-meta-item">
                  <span className="meta-icon">📍</span>
                  <div>
                    <strong>Mekan:</strong> {eventLocation}
                    {eventMapUrl && (
                      <a
                        href={eventMapUrl}
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
                  <span className="meta-icon">☕</span>
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
                >
                  <span>Takvime Ekle (.ICS)</span>
                  <span>📥</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  id="btn-google-calendar"
                  onClick={handleGoogleCalendar}
                >
                  <span>Google Takvim'e Kaydet</span>
                  <span>📅</span>
                </button>
                <a
                  href={links.whatsappCoworking || links.whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-full"
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsAppWithRules(
                      links.whatsappCoworking || links.whatsappGeneral,
                      'Coworking & Buluşma Grubu'
                    );
                  }}
                >
                  <span>WhatsApp Grubuna Katıl</span>
                  <span>💬</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
