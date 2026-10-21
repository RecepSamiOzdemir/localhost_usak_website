import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LinksProvider } from './context/LinksContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { GeneralSettingsProvider } from './context/GeneralSettingsContext';
import { WhatsAppModalProvider } from './context/WhatsAppModalContext';
import { Navbar } from './components/layout/Navbar';
import { PullToRefresh } from './components/layout/PullToRefresh';
import { Footer } from './components/layout/Footer';
import { FloatingCTA } from './components/layout/FloatingCTA';
import { InteractiveCanvasBackground } from './components/layout/InteractiveCanvasBackground';

import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { CareersPage } from './pages/CareersPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { AdminPage } from './pages/AdminPage';
import { KvkkPage } from './pages/KvkkPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

// Styles
import './styles/tokens.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/glassmorphism-theme.css';
import './styles/animations.css';
import './styles/subpages.css';
import './styles/whatsapp-rules-modal.css';
import './styles/kvkk.css';
import './styles/careers-form.css';

// Auto scroll to top on page navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Toast notification component for Light (Cream) and Dark (Obsidian) modes
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
          <span className="toast-badge-icon"><Coffee size={18} /></span>
          <div className="toast-content">
            <strong className="toast-title">AYDINLIK MOD DEVREDE</strong>
            <div className="toast-subtitle">
              Sıcak krem & fildişi paletine geçildi.
            </div>
          </div>
        </>
      ) : (
        <>
          <span className="toast-badge-icon modern-glyph">✦</span>
          <div className="toast-content">
            <strong className="toast-title">KARANLIK MOD DEVREDE</strong>
            <div className="toast-subtitle">
              Derin arduvaz & obsidyen paletine geçildi.
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
      <InteractiveCanvasBackground />
      <LevelUnlockedToast />
      <PullToRefresh />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/etkinlikler" element={<EventsPage />} />
        <Route path="/kariyer" element={<CareersPage />} />
        <Route path="/projeler" element={<ProjectsPage />} />
        <Route path="/sponsorlar" element={<SponsorsPage />} />
        <Route path="/kvkk" element={<KvkkPage />} />
        <Route path="/kvkk-aydinlatma-metni" element={<KvkkPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <FloatingCTA />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GeneralSettingsProvider>
          <SiteSettingsProvider>
            <LinksProvider>
              <WhatsAppModalProvider>
                <AppContent />
              </WhatsAppModalProvider>
            </LinksProvider>
          </SiteSettingsProvider>
        </GeneralSettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
