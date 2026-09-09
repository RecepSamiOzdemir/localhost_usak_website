import React from 'react';

interface EventStatsProps {
  totalEvents: number;
  totalAttendees: number;
}

export const EventStats: React.FC<EventStatsProps> = ({ totalEvents, totalAttendees }) => {
  return (
    <div
      className="card circuit-border"
      style={{
        padding: '1.5rem 2rem',
        margin: '3rem 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.5rem',
        textAlign: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
          {totalEvents}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          TOPLAM BULUŞMA
        </div>
      </div>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>
          {totalAttendees}+
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          MASADAKİ SANDALYE
        </div>
      </div>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10B981' }}>
          %100
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          ÜCRETSİZ & AÇIK
        </div>
      </div>

      <div>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#F59E0B' }}>
          ∞
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          İÇİLEN KAHVE
        </div>
      </div>
    </div>
  );
};
