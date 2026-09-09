import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, isCracking, toggleTheme, breachHits, hasBreached } = useTheme();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'nav-scrolled' : ''}`} id="main-nav">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" id="nav-brand-logo" aria-label="localhostusak Ana Sayfa">
          <span>&gt;_</span>
          <span>
            localhost<span className="brand-highlight">[uşak]</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links" aria-label="Ana Menü">
          <Link
            to="/"
            id="nav-link-home"
            style={{ color: isActive('/') ? 'var(--accent-primary)' : undefined, fontWeight: isActive('/') ? 700 : 400 }}
          >
            // ana sayfa
          </Link>
          <Link
            to="/etkinlikler"
            id="nav-link-events"
            style={{ color: isActive('/etkinlikler') ? 'var(--accent-primary)' : undefined, fontWeight: isActive('/etkinlikler') ? 700 : 400 }}
          >
            // etkinlikler
          </Link>
          <Link
            to="/kariyer"
            id="nav-link-careers"
            style={{ color: isActive('/kariyer') ? 'var(--accent-primary)' : undefined, fontWeight: isActive('/kariyer') ? 700 : 400 }}
          >
            // kariyer
          </Link>
          <Link
            to="/projeler"
            id="nav-link-projects"
            style={{ color: isActive('/projeler') ? 'var(--accent-primary)' : undefined, fontWeight: isActive('/projeler') ? 700 : 400 }}
          >
            // projeler
          </Link>
        </nav>

        {/* Action Buttons: Classic Theme Toggle Button with Crescent Moon / Sun & Eye-Catching Crack */}
        <div className="nav-actions">
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
            style={{ display: 'none' }}
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Link to="/" style={{ color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            // ana sayfa
          </Link>
          <Link to="/etkinlikler" style={{ color: isActive('/etkinlikler') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            // etkinlikler
          </Link>
          <Link to="/kariyer" style={{ color: isActive('/kariyer') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            // kariyer
          </Link>
          <Link to="/projeler" style={{ color: isActive('/projeler') ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            // projeler
          </Link>
          <Link to="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            // [admin paneli]
          </Link>
        </div>
      )}
    </header>
  );
};
