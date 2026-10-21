import React from 'react';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { WhatsAppIcon } from '../shared';

export const ProjectCTA: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  if (!links.whatsappProjects) return null;
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
        SEN DE ÜRETİYOR MUSUN?
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
          href={links.whatsappProjects}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
          onClick={(e) => {
            e.preventDefault();
            openWhatsAppWithRules(links.whatsappProjects, 'Projeler Grubu');
          }}
        >
          <WhatsAppIcon size={20} />
          <span>WhatsApp Projeler Grubuna Katıl</span>
        </a>
      </div>
    </div>
  );
};
