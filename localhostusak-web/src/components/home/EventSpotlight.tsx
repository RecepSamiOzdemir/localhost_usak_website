import React from 'react';
import { CountdownTimer } from '../shared/CountdownTimer';
import { downloadICS, openGoogleCalendar } from '../../utils/calendarExport';
import { useLinks } from '../../context/LinksContext';

export const EventSpotlight: React.FC = () => {
  const { links } = useLinks();
  const meetupDate = new Date('2026-09-28T14:00:00');

  const handleDownloadICS = () => {
    downloadICS({
      title: 'localhostusak Buluşması #3',
      description: 'Uşak teknoloji ve tasarım topluluğu buluşması. Kahveni al, laptopunu getir!',
      location: 'Coff The Story / Treehouse Cafe, Uşak',
      startDate: meetupDate,
      durationHours: 3,
    });
  };

  const handleGoogleCalendar = () => {
    openGoogleCalendar({
      title: 'localhostusak Buluşması #3',
      description: 'Uşak teknoloji ve tasarım topluluğu buluşması. Kahveni al, laptopunu getir!',
      location: 'Coff The Story, Uşak',
      startDate: meetupDate,
      durationHours: 3,
    });
  };

  return (
    <section className="section" id="events" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// BULUŞMA TAKVİMİ</span>
          <h2 className="section-title">Sıradaki Buluşma: Buluşma #3</h2>
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
                <span className="badge badge-orange">#03. BULUŞMA</span>
                <span className="badge badge-blue">YÜZ YÜZE</span>
                <span className="badge badge-live">KATILIM ÜCRETSİZ</span>
              </div>

              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: '0.75rem' }}>
                Kahve, Kod ve Gelecek Projeler
              </h3>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Uşak'ta teknolojiyle ilgilenen herkesin bir araya geldiği, projelerini anlattığı, takıldığı noktalarda birbirine destek olduğu ve keyifli bir kahve eşliğinde networking yaptığı 3. buluşmamız!
              </p>

              {/* Meetup Metadata List */}
              <div className="meetup-meta-list">
                <div className="meetup-meta-item">
                  <span className="meta-icon">📅</span>
                  <div>
                    <strong>Tarih:</strong> 28 Eylül 2026 Pazar, 14:00 - 17:00
                  </div>
                </div>
                <div className="meetup-meta-item">
                  <span className="meta-icon">📍</span>
                  <div>
                    <strong>Mekan:</strong> Coff The Story / Treehouse Cafe, Uşak
                    <a
                      href="https://maps.google.com/?q=Uşak+Coff+The+Story"
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
                <span className="agenda-tag">#WebDev</span>
                <span className="agenda-tag">#AI_Agents</span>
                <span className="agenda-tag">#UI_UX</span>
                <span className="agenda-tag">#MobileDev</span>
                <span className="agenda-tag">#Freelance</span>
                <span className="agenda-tag">#CoffeeAndCode</span>
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
              <CountdownTimer targetDate="2026-09-28T14:00:00" />

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
