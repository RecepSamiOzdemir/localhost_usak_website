import React from 'react';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { WhatsAppIcon } from '../shared';

export const BigCTA: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  if (!links.whatsappGeneral && !links.instagram) return null;
  return (
    <section className="section" id="cta" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          className="card circuit-border"
          style={{
            padding: '4.5rem 3rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <span className="section-tag" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            // HEMEN ARAMIZA KATIL
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              marginBottom: '1.25rem',
            }}
          >
            Bir Sonraki Kahveyi <br />
            <span className="gradient-text-orange">Birlikte İçelim</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.15rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            Buluşma duyurularını kaçırmamak, masada yerini ayırtmak ve Uşak'taki diğer teknoloji
            tutkunlarıyla anında iletişim kurmak için WhatsApp grubumuza katıl.
          </p>

          <div className="cta-actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
            {links.whatsappGeneral && <a
              href={links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              id="cta-btn-whatsapp"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
              }}
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>}

            {links.instagram && <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-secondary"
              id="cta-btn-instagram"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#E1306C' }}>
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Instagram'da Takip Et</span>
            </a>}
          </div>
        </div>
      </div>
    </section>
  );
};
