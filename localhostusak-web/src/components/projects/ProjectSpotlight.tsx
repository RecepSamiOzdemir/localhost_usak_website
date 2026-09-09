import React from 'react';
import { ProjectItem } from '../../types/project';

interface ProjectSpotlightProps {
  project: ProjectItem;
}

export const ProjectSpotlight: React.FC<ProjectSpotlightProps> = ({ project }) => {
  return (
    <div
      className="card circuit-border"
      style={{
        padding: '2.5rem',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
        position: 'relative',
      }}
    >
      <span className="hud-corner-tl" aria-hidden="true" />
      <span className="hud-corner-tr" aria-hidden="true" />
      <span className="hud-corner-bl" aria-hidden="true" />
      <span className="hud-corner-br" aria-hidden="true" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-orange">🌟 AYIN ÖNE ÇIKAN PROJESİ</span>
            <span className="badge badge-blue">AÇIK KAYNAK</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            {project.name}
          </h2>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {project.description}
          </p>

          <div className="agenda-tags" style={{ marginBottom: '1.5rem' }}>
            {project.technologies.map((t, idx) => (
              <span key={idx} className="agenda-tag">
                #{t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <span>Projeyi İncele</span>
                <span>🚀</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <span>GitHub'da Yıldızla ({project.likes} ⭐)</span>
                <span>🐙</span>
              </a>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            className="card card-glass"
            style={{
              padding: '2rem',
              display: 'inline-block',
              maxWidth: '360px',
              border: '1px solid var(--border-laser)',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💻</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
              // TOPLULUK İÇİN AÇIK KAYNAK
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Katkıda bulunmak için depoyu fork'la, bir issue seç veya WhatsApp grubunda fikrini paylaş!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
