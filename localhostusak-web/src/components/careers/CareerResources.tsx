import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const CareerResources: React.FC = () => {
  const { settings } = useSiteSettings();
  const resources = settings.careerResources || [];

  return (
    <section style={{ margin: '3.5rem 0' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <span className="section-tag">// KAYNAKLAR & REHBERLER</span>
        <h2 className="section-title">Kariyerini Güçlendirecek Araçlar</h2>
        <p className="section-desc">
          Topluluk üyelerimizin deneyimleriyle hazırlanan ücretsiz kaynaklar ve ipuçları.
        </p>
      </div>

      <div className="grid-4">
        {resources.map((res, i) => (
          <div key={i} className="card card-interactive" style={{ padding: '1.75rem', height: '100%' }}>
            <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{res.icon}</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {res.title}
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              {res.desc}
            </p>
            {res.tag && (
              <span className="agenda-tag" style={{ marginTop: 'auto' }}>
                {res.tag.startsWith('#') ? res.tag : `#${res.tag}`}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
