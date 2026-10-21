import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { WhatsAppIcon } from '../shared';
import { useTheme } from '../../context/ThemeContext';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

// Türk bayrağı: resmî 3:2 oran, ay-yıldız Wikimedia şemasından. Köşe parantezleri CSS ile çizilir (dekoratif).
const TurkishFlag: React.FC = () => (
  <span className="nav-flag" role="img" aria-label="Türk bayrağı" title="Türk bayrağı">
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" rx="2.2" fill="#E30A17" />
      <path
        fill="#FBF8F4"
        d="M13.917 10 18.44 8.531 15.645 12.378V7.622L18.44 11.469ZM14.225 12.674a5 5 0 1 1 0-5.348 4 4 0 1 0 0 5.348Z"
      />
      <rect className="flag-edge" width="30" height="20" rx="2.2" fill="none" />
    </svg>
  </span>
);

export const Navbar: React.FC = () => {
  const { theme, isCracking, toggleTheme, breachHits, hasBreached } = useTheme();
  const { settings } = useGeneralSettings();
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change or desktop resize
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggleTheme(x, y);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAnnouncementVisible = Boolean(settings?.header?.announcementActive && settings?.header?.announcementText);

  // Sync fixed navbar height to document root so page content is never hidden
  useEffect(() => {
    const totalHeight = isAnnouncementVisible ? 108 : 72;
    document.documentElement.style.setProperty('--navbar-total-height', `${totalHeight}px`);
  }, [isAnnouncementVisible]);

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'nav-scrolled' : ''}`} id="main-nav">
      {isAnnouncementVisible && (
        <div
          className="announcement-banner"
          style={{
            background: 'linear-gradient(90deg, #E35D14, #E68A3C)',
            color: '#FFFDFC',
            padding: '0.45rem 1rem',
            textAlign: 'center',
            fontSize: '0.825rem',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          {settings?.header?.announcementUrl ? (
            <Link
              to={settings.header.announcementUrl}
              style={{ color: '#FFFDFC', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>{settings.header.announcementText}</span>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
            </Link>
          ) : (
            <span>{settings?.header?.announcementText}</span>
          )}
        </div>
      )}
      <div className="container nav-container">
        {/* Brand Logo Column */}
        <div className="nav-brand-wrapper">
          <Link to="/" className="brand-logo" id="nav-brand-logo" aria-label="Localhost Uşak Ana Sayfa">
            <img
              src="/logo.png"
              alt="Localhost Uşak"
              className="brand-logo-img"
              width={42}
              height={42}
            />
            <span className="brand-logo-text">
              Localhost <span className="brand-highlight">Uşak</span>
            </span>
          </Link>
          {/* Bayrak marka linkinin dışında: ana sayfa linkinin tıklanabilir alanını büyütmez */}
          <TurkishFlag />
        </div>

        {/* Navigation Links Column (Centered Pill) */}
        <nav className="nav-links" aria-label="Ana Menü">
          <Link
            to="/"
            id="nav-link-home"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/etkinlikler"
            id="nav-link-events"
            className={`nav-link ${isActive('/etkinlikler') ? 'active' : ''}`}
          >
            Etkinlikler
          </Link>
          <Link
            to="/kariyer"
            id="nav-link-careers"
            className={`nav-link ${isActive('/kariyer') ? 'active' : ''}`}
          >
            Kariyer
          </Link>
          <Link
            to="/projeler"
            id="nav-link-projects"
            className={`nav-link ${isActive('/projeler') ? 'active' : ''}`}
          >
            Projeler
          </Link>
          <Link
            to="/sponsorlar"
            id="nav-link-sponsors"
            className={`nav-link ${isActive('/sponsorlar') ? 'active' : ''}`}
          >
            Sponsorlar
          </Link>
        </nav>

        {/* Action Buttons Column */}
        <div className="nav-actions">
          {/* Topluluğa Katıl WhatsApp CTA */}
          <button
            type="button"
            className="nav-cta-btn"
            id="nav-btn-join"
            onClick={() => openWhatsAppWithRules(links.whatsappGeneral || 'https://chat.whatsapp.com/I8eMGS58Gtz3dSn9J2mINa', 'Genel Topluluk Grubu')}
            aria-label="WhatsApp Topluluğuna Katıl"
          >
            <WhatsAppIcon size={17} />
            <span>Topluluğumuza Katıl</span>
          </button>

          <button
            className={`theme-toggle-btn ${isCracking ? 'cracking' : ''} ${!hasBreached && breachHits === 1 ? 'crack-stage-1' : ''} ${!hasBreached && breachHits === 2 ? 'crack-stage-2' : ''}`}
            id="btn-theme-toggle"
            onClick={handleThemeClick}
            title={
              hasBreached
                ? (theme === 'modern' ? 'Aydınlık Moduna Geç' : 'Karanlık Moduna Geç')
                : breachHits === 0
                ? 'Temayı Değiştir'
                : breachHits === 1
                ? 'Gerçeklik Çatlıyor... [1/3]'
                : 'Kritik Kırılma! [2/3] - Son Vuruş'
            }
            aria-label="Temayı Değiştir"
          >
            {/* Sun / Moon Celestial Icon */}
            <span className="theme-sky-icon">
              {theme === 'modern' ? (
                /* Crescent Moon (Hilal) */
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  <circle cx="17.5" cy="5.5" r="1" fill="currentColor" />
                </svg>
              ) : (
                /* Sun (Güneş) */
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4.5" fill="none" />
                  <line x1="12" y1="1.5" x2="12" y2="3.5" />
                  <line x1="12" y1="20.5" x2="12" y2="22.5" />
                  <line x1="4.5" y1="4.5" x2="6" y2="6" />
                  <line x1="18" y1="18" x2="19.5" y2="19.5" />
                  <line x1="1.5" y1="12" x2="3.5" y2="12" />
                  <line x1="20.5" y1="12" x2="22.5" y2="12" />
                  <line x1="4.5" y1="19.5" x2="6" y2="18" />
                  <line x1="18" y1="6" x2="19.5" y2="4.5" />
                </svg>
              )}
            </span>

            {/* Eye-Catching Visual Crack Across Button Face — ONLY rendered before reality breach is played */}
            {!hasBreached && (
              <svg
                className="btn-crack-streak"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26 1L21 13L29 22L17 33L21 43"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="crack-path-main"
                />
                <path
                  d="M21 13L13 11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="crack-path-sub"
                />
                <path
                  d="M29 22L37 25"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="crack-path-sub"
                />
                <path
                  d="M17 33L10 38"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="crack-path-sub"
                />
              </svg>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn btn-sm btn-secondary mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menüyü Aç/Kapat"
            style={{ padding: '0.4rem' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            background: 'var(--bg-card)',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-card)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: isActive('/') ? 700 : 500,
            }}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/etkinlikler"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isActive('/etkinlikler') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: isActive('/etkinlikler') ? 700 : 500,
            }}
          >
            Etkinlikler
          </Link>
          <Link
            to="/kariyer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isActive('/kariyer') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: isActive('/kariyer') ? 700 : 500,
            }}
          >
            Kariyer
          </Link>
          <Link
            to="/projeler"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isActive('/projeler') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: isActive('/projeler') ? 700 : 500,
            }}
          >
            Projeler
          </Link>
          <Link
            to="/sponsorlar"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isActive('/sponsorlar') ? 'var(--accent-primary)' : 'var(--text-secondary)',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.05rem',
              fontWeight: isActive('/sponsorlar') ? 700 : 500,
            }}
          >
            Sponsorlar
          </Link>

          {/* Mobile WhatsApp CTA Button */}
          <button
            type="button"
            className="btn btn-whatsapp btn-full"
            onClick={() => {
              setMobileMenuOpen(false);
              openWhatsAppWithRules(links.whatsappGeneral || 'https://chat.whatsapp.com/I8eMGS58Gtz3dSn9J2mINa', 'Genel Topluluk Grubu');
            }}
            style={{
              marginTop: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <WhatsAppIcon size={16} />
            <span>Topluluğumuza Katıl</span>
          </button>
        </div>
      )}
    </header>
  );
};
