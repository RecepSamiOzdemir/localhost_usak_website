import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { WhatsAppIcon } from '../shared';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';

export const Footer: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useGeneralSettings();

  const tagline =
    settings?.footer?.tagline ||
    "Uşak'ın yerel teknoloji ve yazılım ekosistemini büyüten açık ve bağımsız topluluk.";
  const locationCoordinates = settings?.footer?.locationCoordinates || '38.6823° N, 29.4082° E';

  return (
    <footer className="footer-wrapper" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Slogan */}
          <div>
            <Link to="/" className="brand-logo" aria-label="Localhost Uşak Ana Sayfa" style={{ marginBottom: '1.25rem' }}>
              <img
                src="/logo.png"
                alt="Localhost Uşak"
                className="brand-logo-img"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'contain' }}
              />
              <span className="brand-logo-text">
                Localhost <span className="brand-highlight">Uşak</span>
              </span>
            </Link>
            <p
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '380px',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}
            >
              {tagline}
            </p>
            <div className="location-pill">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} style={{ color: 'var(--accent-primary)' }} /> U Ş A K
              </span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                {locationCoordinates}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              SAYFALAR
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                listStyle: 'none',
                padding: 0,
              }}
            >
              <li>
                <Link to="/" style={{ color: 'inherit' }}>Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/etkinlikler" style={{ color: 'inherit' }}>Etkinlikler & Cowork</Link>
              </li>
              <li>
                <Link to="/kariyer" style={{ color: 'inherit' }}>Kariyer & İlanlar</Link>
              </li>
              <li>
                <Link to="/projeler" style={{ color: 'inherit' }}>Projeler & Vitrin</Link>
              </li>
              <li>
                <Link to="/sponsorlar" style={{ color: 'inherit' }}>Sponsorlarımız</Link>
              </li>
              <li>
                <Link to="/kvkk" style={{ color: 'inherit' }}>KVKK & Aydınlatma</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Social Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              BAĞLANTILAR
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                listStyle: 'none',
                padding: 0,
              }}
            >
              {links.whatsappGeneral && <li>
                <a
                  href={links.whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
                  }}
                >
                  <WhatsAppIcon size={16} style={{ color: 'var(--accent-success)' }} />
                  <span>WhatsApp Topluluğu</span>
                </a>
              </li>}
              {links.instagram && <li>
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram (@localhostusak)</span>
                </a>
              </li>}
              {links.github && <li>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  <span>GitHub Deposu</span>
                </a>
              </li>}
              {links.x && <li>
                <a
                  href={links.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X / Twitter</span>
                </a>
              </li>}
            </ul>
          </div>
        </div>

        {/* Bottom Terminal Line & Copyright */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span>connect • build • share • collaborate</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <Link
              to="/kvkk"
              style={{
                color: 'inherit',
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              KVKK Aydınlatma Metni
            </Link>
          </div>
          <div>
            <span>{settings?.footer?.copyrightText || "© 2026 localhostusak • Uşak'ta geliştirildi"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
