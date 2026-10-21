import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CareerItem, CareerType } from '../../types/career';
import { WhatsAppIcon } from '../shared';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

interface CareerCardProps {
  career: CareerItem;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career }) => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const getTypeBadge = (type: CareerType) => {
    switch (type) {
      case 'job':
        return { label: 'İş İlanı', color: '#FF6600' };
      case 'internship':
        return { label: 'Staj', color: '#00E5FF' };
      case 'freelance':
        return { label: 'Freelance', color: '#10B981' };
      case 'mentorship':
        return { label: 'Mentorluk', color: '#8B5CF6' };
      default:
        return { label: 'İlan', color: '#FF6600' };
    }
  };

  const getWorkModeLabel = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'Remote';
      case 'hybrid':
        return 'Hibrit';
      case 'onsite':
        return 'Ofis / Uşak';
      default:
        return mode;
    }
  };

  const getScheduleLabel = (schedule: string) => {
    switch (schedule) {
      case 'fulltime':
        return 'Tam Zamanlı';
      case 'parttime':
        return 'Yarı Zamanlı';
      case 'project':
        return 'Proje Bazlı';
      default:
        return schedule;
    }
  };

  const badgeInfo = getTypeBadge(career.type);
  const createdDate = new Date(career.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <article className="card career-card circuit-border">
      <div>
        <div className="career-title">
          <span>{career.title}</span>
          <span
            className="event-card-type-tag"
            style={{
              backgroundColor: `${badgeInfo.color}22`,
              color: badgeInfo.color,
              border: `1px solid ${badgeInfo.color}`,
              fontSize: '0.75rem',
            }}
          >
            {badgeInfo.label}
          </span>
        </div>

        {career.company && <div className="career-company">{career.company}</div>}

        <div className="career-meta-row">
          <span>{getWorkModeLabel(career.workMode)}</span>
          <span>•</span>
          <span>{getScheduleLabel(career.schedule)}</span>
          <span>•</span>
          <span>Paylaşan: {career.postedBy}</span>
          <span>•</span>
          <span>{createdDate}</span>
        </div>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.925rem',
            lineHeight: 1.6,
            marginBottom: '1rem',
          }}
        >
          {career.description}
        </p>

        {career.technologies && career.technologies.length > 0 && (
          <div className="career-tags">
            {career.technologies.map((tech, idx) => (
              <span key={idx} className="agenda-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="career-actions">
        {career.applyUrl ? (
          <a
            href={career.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <span>Başvur</span>
            <ExternalLink size={14} />
          </a>
        ) : links.whatsappCareers ? (
          <a
            href={links.whatsappCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
            onClick={(e) => {
              e.preventDefault();
              openWhatsAppWithRules(links.whatsappCareers, 'Kariyer & İlanlar');
            }}
          >
            <WhatsAppIcon size={14} />
            <span>Detay / İletişim</span>
          </a>
        ) : null}

        {career.contact && (
          <div className="career-contact-hint">
            {career.contact}
          </div>
        )}
      </div>
    </article>
  );
};
