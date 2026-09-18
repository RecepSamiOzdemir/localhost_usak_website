import React from 'react';
import { Link } from 'react-router-dom';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';

export const Footer: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useGeneralSettings();

  const tagline =
    settings?.footer?.tagline ||
    "Uşak'ın yerel teknoloji, yazılım ve tasarım ekosistemini büyüten açık ve bağımsız topluluk.";
  const locationCoordinates = settings?.footer?.locationCoordinates || '38.6823° N, 29.4082° E';

  return (
    <footer className="footer-wrapper" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Slogan */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
              <span>&gt;_</span>
              <span>
                localhost<span className="brand-highlight">[uşak]</span>
              </span>
            </div>
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
              <span>📍 U Ş A K</span>
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
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              // SAYFALAR
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                listStyle: 'none',
                padding: 0,
              }}
            >
              <li>
                <Link to="/">// Ana Sayfa</Link>
              </li>
              <li>
                <Link to="/etkinlikler">// Etkinlikler & Cowork</Link>
              </li>
              <li>
                <Link to="/kariyer">// Kariyer & İlanlar</Link>
              </li>
              <li>
                <Link to="/projeler">// Projeler & Vitrin</Link>
              </li>
              <li>
                <Link to="/admin" style={{ opacity: 0.6 }}>// Admin Paneli</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Social Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
              }}
            >
              // BAĞLANTILAR
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                listStyle: 'none',
                padding: 0,
              }}
            >
              <li>
                <a
                  href={links.whatsappGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
                  }}
                >
                  💬 WhatsApp Topluluğu
                </a>
              </li>
              <li>
                <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                  📷 Instagram (@localhostusak)
                </a>
              </li>
              <li>
                <a href={links.github} target="_blank" rel="noopener noreferrer">
                  🐙 GitHub Deposu
                </a>
              </li>
              <li>
                <a href={links.x} target="_blank" rel="noopener noreferrer">
                  🐦 X / Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Terminal Line & Copyright */}
        <div className="footer-bottom">
          <div>
            <span>&lt;/&gt; connect • build • share • collaborate &#123; &#125;</span>
          </div>
          <div>
            <span>{settings?.footer?.copyrightText || "© 2026 localhostusak • Uşak'ta sevgiyle kodlandı 🧡"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
