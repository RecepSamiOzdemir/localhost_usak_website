import React from 'react';

interface PageHeroProps {
  tag: string;
  title: string;
  highlightText?: string;
  description: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
  secondaryAction?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  title,
  highlightText,
  description,
  whatsappUrl = 'https://chat.whatsapp.com/',
  whatsappLabel = 'WhatsApp Grubuna Katıl',
  secondaryAction,
}) => {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <span className="section-tag" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          {tag}
        </span>

        <h1 className="page-hero-title">
          {title}{' '}
          {highlightText && <span className="gradient-text">{highlightText}</span>}
        </h1>

        <p className="page-hero-desc">{description}</p>

        <div className="page-hero-actions">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <span>💬</span>
              <span>{whatsappLabel}</span>
            </a>
          )}
          {secondaryAction}
        </div>
      </div>
    </section>
  );
};
