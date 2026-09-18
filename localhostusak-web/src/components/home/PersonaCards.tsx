import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const PersonaCards: React.FC = () => {
  const { settings } = useSiteSettings();
  const personas = settings.personas || [];

  return (
    <section className="section" id="personas">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// MASADA KİMLER VAR?</span>
          <h2 className="section-title">Kimler Katılabilir?</h2>
          <p className="section-desc">
            Teknolojiye merakı olan herkese kapımız açık. Masadaki yerini seç!
          </p>
        </div>

        <div className="grid-4">
          {personas.map((persona, index) => {
            const tags = persona.tags
              ? persona.tags.split(',').map((t) => t.trim())
              : [];

            return (
              <article key={index} className="card card-interactive persona-card">
                <div className="persona-icon-box" aria-hidden="true">
                  {persona.icon}
                </div>
                <h3 className="persona-title">{persona.title}</h3>
                <p className="persona-desc">{persona.description}</p>
                {tags.length > 0 && (
                  <div className="persona-tags">
                    {tags.map((t, idx) => (
                      <span key={idx} className="persona-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
