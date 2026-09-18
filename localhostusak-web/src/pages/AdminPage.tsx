import React, { useEffect } from 'react';

export const AdminPage: React.FC = () => {
  useEffect(() => {
    // In local development on port 5173, redirect to Payload CMS on port 3000
    // In production, Nginx proxies /admin directly to Payload CMS
    const isDev = window.location.port === '5173';
    const targetUrl = isDev ? 'http://localhost:3000/admin' : '/admin';

    const timer = setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const isDev = typeof window !== 'undefined' && window.location.port === '5173';
  const targetUrl = isDev ? 'http://localhost:3000/admin' : '/admin';

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div
        className="card circuit-border"
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Payload CMS Yönetim Paneli
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Topluluk etkinlikleri, kariyer ilanları, projeler ve medya içeriklerini yönetebileceğin modern CMS paneline yönlendiriliyorsun...
        </p>

        <a href={targetUrl} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Yönetim Paneline Git</span>
          <span>↗</span>
        </a>
      </div>
    </main>
  );
};
