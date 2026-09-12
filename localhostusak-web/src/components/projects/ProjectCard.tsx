import React, { useState } from 'react';
import { ProjectItem, ProjectType } from '../../types/project';
import { soundFX } from '../../utils/audioFx';
import { useLinks } from '../../context/LinksContext';

interface ProjectCardProps {
  project: ProjectItem;
  onLike?: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike }) => {
  const { links } = useLinks();
  const [likes, setLikes] = useState(project.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const getTypeBadge = (type: ProjectType) => {
    switch (type) {
      case 'showcase':
        return { label: 'Vitrin', icon: '🚀', color: '#FF6600' };
      case 'seeking_team':
        return { label: 'Ekip Arıyor', icon: '🤝', color: '#00E5FF' };
      case 'opensource':
        return { label: 'Açık Kaynak', icon: '🐙', color: '#10B981' };
      default:
        return { label: 'Proje', icon: '📦', color: '#FF6600' };
    }
  };

  const badgeInfo = getTypeBadge(project.type);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      soundFX.playBlip();
      if (onLike) onLike(project.id);
    }
  };

  return (
    <article className="card project-card circuit-border">
      <div>
        <div className="project-header">
          <span
            className="event-card-type-tag"
            style={{
              backgroundColor: `${badgeInfo.color}22`,
              color: badgeInfo.color,
              border: `1px solid ${badgeInfo.color}`,
              fontSize: '0.75rem',
            }}
          >
            {badgeInfo.icon} {badgeInfo.label}
          </span>

          <button
            type="button"
            className={`project-like-btn ${hasLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Projeyi Beğen"
          >
            <span>{hasLiked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          {project.name}
        </h3>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--accent-secondary)',
            marginBottom: '0.85rem',
          }}
        >
          Geliştirici: {project.owner}
        </div>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {project.description}
        </p>

        {/* Roles Needed if Seeking Team */}
        {project.type === 'seeking_team' && project.rolesNeeded && project.rolesNeeded.length > 0 && (
          <div className="project-roles-needed">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-secondary)',
                marginBottom: '0.35rem',
              }}
            >
              🤝 ARANAN EKİP ROLLERİ:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {project.rolesNeeded.map((role, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="agenda-tags" style={{ marginBottom: '1.25rem' }}>
            {project.technologies.map((t, idx) => (
              <span key={idx} className="agenda-tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <span>Canlı Demo</span>
            <span>↗</span>
          </a>
        )}

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <span>GitHub</span>
            <span>🐙</span>
          </a>
        )}

        {!project.demoUrl && !project.githubUrl && (
          <a
            href={links.whatsappProjects}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <span>Ekiple İletişime Geç</span>
            <span>💬</span>
          </a>
        )}
      </div>
    </article>
  );
};
