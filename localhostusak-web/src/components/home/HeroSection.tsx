import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '../shared';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SiteVisionMessageItem } from '../../services/api';

const DEFAULT_HERO_VISION: SiteVisionMessageItem[] = [
  {
    quote: 'Resmiyetten uzak, samimi bir masa. Good Code, Better People.',
    tag: 'TOPLULUK VİZYONU',
  },
  {
    quote: "Uşak'ta sürdürülebilir, samimi ve profesyonel bir teknoloji ekosistemi oluşturmak.",
    tag: 'YOL HARİTAMIZ & VİZYONUMUZ',
  },
  {
    quote: 'Kahveni al, masaya otur. Birlikte düşündüğümüzde ve ürettiğimizde çok daha güçlüyüz.',
    tag: 'GOOD CODE, BETTER PEOPLE',
  },
  {
    quote: "Büyük şehirlerdeki teknoloji enerjisini Uşak'ın üretken yetenekleriyle buluşturuyoruz.",
    tag: 'YEREL DAYANIŞMA, KÜRESEL VİZYON',
  },
];

export const HeroSection: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useSiteSettings();
  const hero = settings.hero;

  const visionList =
    settings.visionMessages && settings.visionMessages.length > 0
      ? settings.visionMessages
      : DEFAULT_HERO_VISION;

  const [activeVisionIdx, setActiveVisionIdx] = useState(0);

  useEffect(() => {
    if (visionList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveVisionIdx((prev) => (prev + 1) % visionList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [visionList.length]);

  const activeVision = visionList[activeVisionIdx] || visionList[0];

  return (
    <section className="section hero-section" id="hero">

      {/* Glowing Ambient Background Orbs */}
      <div className="hero-glow-orb" aria-hidden="true" />
      <div className="hero-glow-orb-secondary" aria-hidden="true" />

      <div className="container hero-content">
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Topluluk Logosu Rozeti */}
          <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="hero-logo-emblem" aria-label="Localhost Uşak Topluluk Logosu">
              <img
                src="/logo.png"
                alt="Localhost Uşak"
                className="hero-logo-emblem-img"
                width={76}
                height={76}
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            {hero?.title || "Uşak'ta Teknoloji"} <br />
            <span className="gradient-text">{hero?.titleHighlight || 'Etrafında Buluş'}</span>
          </h1>

          {/* Section Tag Subtitle */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(227, 93, 20, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(227, 93, 20, 0.25)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                padding: '0.4rem 1rem',
              }}
            >
              {hero?.subtitle || 'CONNECT • BUILD • COLLABORATE • GROW'}
            </span>
          </div>

          {/* Hero Description Quote */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            {hero?.description ||
              "Kahveni al, laptopunu getir, masada yerini al. Uşak'ın yerel teknoloji ekosistemini birlikte büyütüyoruz."}
          </p>

          {/* Primary Hero Actions */}
          <div
            className="hero-actions"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '3.5rem',
            }}
          >
            {links.whatsappGeneral && <a
              href={links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              id="hero-btn-whatsapp"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
              }}
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>}

            <Link to="/etkinlikler" className="btn btn-lg btn-primary" id="hero-btn-events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>Sıradaki Buluşma</span>
              <Calendar size={18} />
            </Link>

            {links.instagram && <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-secondary"
              id="hero-btn-instagram"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@localhostusak</span>
            </a>}
          </div>

          {/* Topluluk Vizyonu Kartı (Dinamik Dönen Mesajlar - Boyut Değişimini Önleyen Stabil Alan) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="hero-vision-card" aria-live="polite">
              <div className="hero-vision-icon" aria-hidden="true">
                ✦
              </div>
              <div className="hero-vision-body">
                <div className="hero-vision-tag">
                  {activeVision.tag || 'TOPLULUK VİZYONU'}
                </div>
                <div key={activeVisionIdx} className="hero-vision-quote">
                  "{activeVision.quote}"
                </div>
              </div>
            </div>
          </div>

          {/* Uşak ve Koordinat Kartı (Topluluk Vizyonu ile Manifesto Arasında) */}
          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="location-pill">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} style={{ color: 'var(--accent-primary)' }} /> U Ş A K
              </span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                {hero?.cityCoordinates || '38.6823° N, 29.4082° E'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
