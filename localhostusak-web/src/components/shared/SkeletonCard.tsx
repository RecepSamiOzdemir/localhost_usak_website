import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div
      className="card"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        opacity: 0.6,
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    >
      <div
        style={{
          width: '35%',
          height: '20px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
        }}
      />
      <div
        style={{
          width: '75%',
          height: '28px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '50px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
        }}
      />
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '24px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        />
        <div
          style={{
            width: '80px',
            height: '24px',
            background: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        />
      </div>
    </div>
  );
};
