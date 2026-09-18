import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const FlowSteps: React.FC = () => {
  const { settings } = useSiteSettings();
  const steps = settings.flowSteps || [];

  return (
    <section className="section" id="flow">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// BULUŞMA FORMATI</span>
          <h2 className="section-title">Buluşmada Neler Olur?</h2>
          <p className="section-desc">
            İlk kez geleceksen endişelenme! 4 adımlı doğal ve rahat akışımız seni bekliyor.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {steps.map((s, index) => (
            <div key={index} className="flow-step">
              <div className="flow-number">{s.num}</div>
              <div className="flow-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
