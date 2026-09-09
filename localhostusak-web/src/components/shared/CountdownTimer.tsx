import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: string | Date;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div
        style={{
          padding: '1rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-primary)',
          fontWeight: 700,
        }}
      >
        🎉 Etkinlik Başladı veya Tamamlandı!
      </div>
    );
  }

  return (
    <div className="countdown-grid" id="countdown-timer">
      <div className="countdown-box">
        <div className="countdown-num" id="cd-days">
          {days}
        </div>
        <div className="countdown-label">GÜN</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num" id="cd-hours">
          {hours}
        </div>
        <div className="countdown-label">SAAT</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num" id="cd-minutes">
          {minutes}
        </div>
        <div className="countdown-label">DAKİKA</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-num" id="cd-seconds">
          {seconds}
        </div>
        <div className="countdown-label">SANİYE</div>
      </div>
    </div>
  );
};
