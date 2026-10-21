import React from 'react';
import { ExternalLink, Star, Code2 } from 'lucide-react';
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
            <span className="badge badge-orange">AYIN ÖNE ÇIKAN PROJESİ</span>
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Projeyi İncele</span>
                <ExternalLink size={16} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
                <span>GitHub'da Yıldızla ({project.likes}</span>
                <Star size={14} style={{ fill: 'currentColor', color: '#F59E0B' }} />
                <span>)</span>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Code2 size={44} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
            </div>
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
