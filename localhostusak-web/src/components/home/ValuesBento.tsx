import React from 'react';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const ValuesBento: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useSiteSettings();
  const values = settings.values || [];

  return (
    <section className="section" id="values" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// DEĞERLERİMİZ</span>
          <h2 className="section-title">Neden Gelmelisin?</h2>
          <p className="section-desc">
            Uşak'ta teknolojiyle ilgilenen herkes için güvenli, üretken ve samimi bir liman.
          </p>
        </div>

        <div className="bento-grid">
          {values.map((val, idx) => {
            const isWide = idx === 0 || idx === 3 || idx % 3 === 0;
            const tags = val.tags ? val.tags.split(',').map((t) => t.trim()) : [];

            return (
              <div
                key={idx}
                className={`card bento-card ${isWide ? 'bento-span-8 circuit-border' : 'bento-span-4'}`}
              >
                <div>
                  <div className="bento-icon" aria-hidden="true">
                    {val.icon}
                  </div>
                  <h3 style={{ fontSize: isWide ? '1.6rem' : '1.35rem', marginBottom: '0.75rem' }}>
                    {val.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      fontSize: isWide ? '1.05rem' : '1rem',
                    }}
                  >
                    {val.description}
                  </p>
                </div>

                {tags.length > 0 && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className={tIdx % 2 === 0 ? 'badge badge-orange' : 'badge badge-blue'}>
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* If last card, offer WhatsApp button */}
                {idx === values.length - 1 && (
                  <div style={{ marginTop: '2rem' }}>
                    <a
                      href={links.whatsappGeneral}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
                      }}
                    >
                      <span>İlk Adımı At: WhatsApp'a Katıl</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
