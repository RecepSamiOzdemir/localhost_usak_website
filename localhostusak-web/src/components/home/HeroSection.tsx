import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  const { settings } = useSiteSettings();
  const hero = settings.hero;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let animationFrameId: number;
    const particleCount = 45;
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 140,
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isBlue: boolean;

      constructor() {
        this.x = Math.random() * (width || 800);
        this.y = Math.random() * (height || 600);
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1.5;
        this.isBlue = Math.random() > 0.75;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw(isPixel: boolean) {
        if (!ctx) return;
        ctx.beginPath();
        if (isPixel) {
          ctx.fillStyle = this.isBlue ? '#3A86FF' : '#EE6C19';
          ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        } else {
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.isBlue ? '#00E5FF' : '#FF6600';
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.isBlue ? '#00E5FF' : '#FF6600';
          ctx.fill();
        }
      }
    }

    let particles: Particle[] = [];

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const isPixel = theme === 'pixel';

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (isPixel) {
              ctx.strokeStyle = `rgba(92, 61, 46, ${0.15 * (1 - dist / 110)})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(255, 102, 0, ${0.25 * (1 - dist / 110)})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(isPixel);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <section className="section hero-section" id="hero">
      {/* Interactive Constellation / Circuit Background Canvas */}
      <div className="hero-canvas-container" aria-hidden="true">
        <canvas id="hero-canvas" ref={canvasRef} />
      </div>

      {/* Glowing Ambient Background Orbs (Modern Mode) */}
      <div className="hero-glow-orb" aria-hidden="true" />
      <div className="hero-glow-orb-secondary" aria-hidden="true" />
      <div className="scanline-effect" aria-hidden="true" />

      <div className="container hero-content">
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          {/* Location Pill */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="location-pill">
              <span>📍 U Ş A K</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                {hero?.cityCoordinates || '38.6823° N, 29.4082° E'}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            {hero?.title || "Uşak'ın Teknoloji ve"} <br />
            <span className="gradient-text">{hero?.titleHighlight || 'Tasarım Topluluğu'}</span>
          </h1>

          {/* Terminal Prompt Subtitle */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
              color: 'var(--text-code)',
              marginBottom: '1.5rem',
            }}
          >
            <span>&gt;_ {hero?.subtitle || 'connect • build • collaborate • grow'}</span>
            <span className="terminal-cursor" />
          </div>

          {/* Hero Description Quote */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            {hero?.description ||
              'Kahveni al, laptopunu getir, aramıza katıl. Deneyimli olmak şart değil; merakın ve öğrenme isteğin varsa masada sana da yer var.'}
          </p>

          {/* Primary Hero Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '3.5rem',
            }}
          >
            <a
              href={links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              id="hero-btn-whatsapp"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.938l-1.564 5.719 5.873-1.541c1.707.95 3.666 1.484 5.727 1.484 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>

            <Link to="/etkinlikler" className="btn btn-lg btn-primary" id="hero-btn-events">
              <span>Sıradaki Buluşma</span>
              <span>📅</span>
            </Link>

            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-secondary"
              id="hero-btn-instagram"
            >
              <span>📷 @localhostusak</span>
            </a>
          </div>

          {/* Reference Community Motto Pill Preview */}
          <div>
            <div
              className="card card-glass circuit-border"
              style={{
                padding: '1.25rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.5rem',
                maxWidth: '600px',
              }}
            >
              <span className="circuit-node" />
              <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-primary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                  }}
                >
                  // TOPLULUK MOTOSU
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  "Resmiyetten uzak, samimi bir masa. Good Code, Better People."
                </div>
              </div>
              <span className="circuit-node node-blue" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
