import React from 'react';

export const ProjectCTA: React.FC = () => {
  return (
    <div
      className="card circuit-border"
      style={{
        padding: '3.5rem 2.5rem',
        textAlign: 'center',
        margin: '3rem 0',
        background: 'var(--bg-secondary)',
      }}
    >
      <span className="section-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        // SEN DE ÜRETİYOR MUSUN?
      </span>
      <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: '1rem' }}>
        Side-Project'ini Topluluk Vitrinine Ekle
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '620px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.7,
        }}
      >
        Geliştirdiğin bir açık kaynak kütüphane, mobil uygulama veya SaaS girişimi mi var?
        Projeler grubumuzda paylaş, yapıcı geri bildirimler al ve eksik roller için ekip arkadaşları bul.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href="https://chat.whatsapp.com/dummy-projeler"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-lg"
        >
          <span>💬 WhatsApp Projeler Grubuna Katıl</span>
        </a>
      </div>
    </div>
  );
};
