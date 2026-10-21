import { usePageMeta } from '../hooks/usePageMeta';
import React, { useEffect } from 'react';
import { Settings, ExternalLink } from 'lucide-react';

const configuredApi = import.meta.env.VITE_API_URL;
const adminUrl = configuredApi && /^https?:\/\//.test(configuredApi)
  ? new URL('/admin', configuredApi).toString()
  : import.meta.env.DEV ? 'http://localhost:3000/admin' : '/admin';

export const AdminPage: React.FC = () => {
  usePageMeta({ noindex: true, title: "Yönetim Paneli | localhostusak" });
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = adminUrl;
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Settings size={48} style={{ color: 'var(--accent-primary)' }} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Payload CMS Yönetim Paneli
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Topluluk etkinlikleri, kariyer ilanları, projeler ve medya içeriklerini yönetebileceğin modern CMS paneline yönlendiriliyorsun...
        </p>

        <a href={adminUrl} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Yönetim Paneline Git</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </main>
  );
};
