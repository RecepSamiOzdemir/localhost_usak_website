import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatItem {
  target: number;
  prefix: string;
  suffix: string;
  label: string;
}

const statsData: StatItem[] = [
  { target: 150, prefix: '', suffix: '+', label: 'Topluluk Üyesi' },
  { target: 2, prefix: '#', suffix: '', label: 'Başarılı Buluşma' },
  { target: 240, prefix: '', suffix: '+', label: 'İçilen Sıcak Kahve' },
  { target: 100, prefix: '%', suffix: '', label: 'Açık Kaynak & Bağımsız' },
];

export const StatsSection: React.FC = () => {
  const { theme } = useTheme();
  const [counts, setCounts] = useState<number[]>(statsData.map(() => 0));
  const sectionRef = useRef<HTMLElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const duration = 1800;
            const startTime = performance.now();

            const update = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

              setCounts(statsData.map((s) => Math.floor(easeOut * s.target)));

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setCounts(statsData.map((s) => s.target));
              }
            };

            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="stats" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// SCOREBOARD & STATS</span>
          <h2 className="section-title">Rakamlarla Topluluk</h2>
          <p className="section-desc">
            Her buluşmada büyüyen, birlikte üreten ve paylaşan Uşak ekosistemi.
          </p>
        </div>

        <div className="grid-4">
          {statsData.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-number">
                {stat.prefix}
                {counts[i]}
                {stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 8-Bit Pixel People Chain in Pixel Mode */}
        {theme === 'pixel' && (
          <div
            className="pixel-people-line"
            aria-hidden="true"
            style={{
              textAlign: 'center',
              fontSize: '1.75rem',
              marginTop: '3rem',
              letterSpacing: '0.4rem',
            }}
          >
            🧍‍♂️ 🧍‍♀️ ☕ 💻 🧍‍♂️ 🧡 🧍‍♀️ 🎮 🧍‍♂️
          </div>
        )}
      </div>
    </section>
  );
};
