import { usePageMeta } from '../hooks/usePageMeta';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Calendar } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  usePageMeta({ noindex: true, title: "Sayfa Bulunamadı | localhostusak" });
  const { theme } = useTheme();

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div
        className="card circuit-border"
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          padding: '3.5rem 2rem',
          background: theme === 'modern' ? 'rgba(12, 16, 24, 0.85)' : 'var(--bg-secondary)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          borderRadius: theme === 'pixel' ? '0' : '16px',
          boxShadow: theme === 'modern' ? '0 12px 40px rgba(0, 229, 255, 0.08)' : '4px 4px 0 #000',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            background: 'rgba(255, 102, 0, 0.12)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(255, 102, 0, 0.3)',
            marginBottom: '1.5rem',
            letterSpacing: '0.1em',
          }}
        >
          ERROR 404: SIGNAL LOST
        </div>

        <h1
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 1rem',
            letterSpacing: '-0.03em',
            fontFamily: theme === 'pixel' ? "'Press Start 2P', monospace" : 'inherit',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          {theme === 'pixel' ? 'BÖLÜM BULUNAMADI!' : 'Sinyal Kayboldu'}
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '440px',
            margin: '0 auto 2rem',
          }}
        >
          Aradığın sayfa mevcut değil, taşınmış veya henüz kodlanmamış olabilir. Koordinatları kontrol edip üsse dönebilirsin.
        </p>

        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: theme === 'pixel' ? '0' : '8px',
            padding: '1rem',
            marginBottom: '2rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            textAlign: 'left',
            color: 'var(--text-secondary)',
          }}
        >
          <div><span style={{ color: 'var(--accent-primary)' }}>&gt;</span> PATH: {typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</div>
          <div><span style={{ color: '#00E5FF' }}>&gt;</span> STATUS: 404_PAGE_NOT_FOUND</div>
          <div><span style={{ color: '#00FF66' }}>&gt;</span> PROTOCOL: REROUTE_RECOMMENDED</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} />
            <span>Anasayfaya Dön</span>
          </Link>
          <Link to="/etkinlikler" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            <span>Etkinliklere Göz At</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
