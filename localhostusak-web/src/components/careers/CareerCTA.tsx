import React from 'react';
import { useLinks } from '../../context/LinksContext';

export const CareerCTA: React.FC = () => {
  const { links } = useLinks();
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
        // ŞİRKETLER & EKİPLER İÇİN
      </span>
      <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: '1rem' }}>
        Ekibine Uşak'tan Yetenek mi Arıyorsun?
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.7,
        }}
      >
        İş veya staj ilanını toplulukta paylaşmak tamamen ücretsizdir. WhatsApp Kariyer grubumuzda
        yayınlamak için topluluk moderatörlerine mesaj atabilir veya grupta doğrudan paylaşabilirsin.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={links.whatsappCareers}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-lg"
        >
          <span>💬 WhatsApp Kariyer Grubuna Katıl</span>
        </a>
      </div>
    </div>
  );
};
