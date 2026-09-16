import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LinksProvider } from './context/LinksContext';
import { WhatsAppModalProvider } from './context/WhatsAppModalContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingCTA } from './components/layout/FloatingCTA';

import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { CareersPage } from './pages/CareersPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AdminPage } from './pages/AdminPage';

// Styles
import './styles/tokens.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/modern-theme.css';
import './styles/pixel-theme.css';
import './styles/animations.css';
import './styles/subpages.css';
import './styles/whatsapp-rules-modal.css';

// Auto scroll to top on page navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Toast notification component for both Retro Kafe and Cyber HUD modes
const LevelUnlockedToast: React.FC = () => {
  const { isUnlockedToastVisible, closeToast, toastTheme } = useTheme();

  return (
    <aside
      id="level-unlocked-toast"
      className={`level-unlocked-toast ${toastTheme === 'modern' ? 'toast-modern' : 'toast-pixel'} ${isUnlockedToastVisible ? 'show' : ''}`}
      aria-live="polite"
      onClick={closeToast}
      style={{ cursor: 'pointer' }}
    >
      {toastTheme === 'pixel' ? (
        <>
          <span className="toast-badge-icon">☕</span>
          <div className="toast-content">
            <strong className="toast-title">LEVEL UNLOCKED: COZY RETRO MODE! 🕹️</strong>
            <div className="toast-subtitle">
              Uşak kafe masasına hoş geldin!
            </div>
          </div>
        </>
      ) : (
        <>
          <span className="toast-badge-icon modern-glyph">&gt;_</span>
          <div className="toast-content">
            <div className="toast-status-tag">// SYSTEM RESTORED: HUD ONLINE</div>
            <strong className="toast-title">CYBER HUD MODE ACTIVATED ⚡</strong>
            <div className="toast-subtitle">
              Terminal oturumu başlatıldı. Uşak tech stack devrede.
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LevelUnlockedToast />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/etkinlikler" element={<EventsPage />} />
        <Route path="/kariyer" element={<CareersPage />} />
        <Route path="/projeler" element={<ProjectsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <Footer />
      <FloatingCTA />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LinksProvider>
        <WhatsAppModalProvider>
          <AppContent />
        </WhatsAppModalProvider>
      </LinksProvider>
    </ThemeProvider>
  );
};

export default App;
