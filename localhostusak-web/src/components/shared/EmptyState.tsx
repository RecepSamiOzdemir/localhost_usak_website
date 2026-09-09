import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🔍',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state-box">
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 800 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
