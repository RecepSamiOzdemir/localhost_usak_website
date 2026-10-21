import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ParticleColor {
  fill: string;
  glow: string;
  name: 'terracotta' | 'gold' | 'cobalt' | 'sage';
}

export const InteractiveCanvasBackground: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 160,
    };

    const isLightMode = theme === 'pixel';

    // Themed 4-color palette
    const getColors = (isLight: boolean): ParticleColor[] => [
      {
        name: 'terracotta',
        fill: isLight ? 'rgba(227, 93, 20, 0.85)' : 'rgba(227, 93, 20, 0.95)',
        glow: isLight ? 'rgba(227, 93, 20, 0.35)' : 'rgba(227, 93, 20, 0.55)',
      },
      {
        name: 'gold',
        fill: isLight ? 'rgba(184, 134, 11, 0.85)' : 'rgba(212, 175, 55, 0.95)',
        glow: isLight ? 'rgba(184, 134, 11, 0.4)' : 'rgba(212, 175, 55, 0.6)',
      },
      {
        name: 'cobalt',
        fill: isLight ? 'rgba(37, 99, 235, 0.85)' : 'rgba(59, 130, 246, 0.95)',
        glow: isLight ? 'rgba(37, 99, 235, 0.4)' : 'rgba(59, 130, 246, 0.65)',
      },
      {
        name: 'sage',
        fill: isLight ? 'rgba(38, 122, 86, 0.85)' : 'rgba(46, 160, 110, 0.95)',
        glow: isLight ? 'rgba(38, 122, 86, 0.35)' : 'rgba(46, 160, 110, 0.55)',
      },
    ];

    let colorPalette = getColors(isLightMode);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      color: ParticleColor;
      isPulsar: boolean;
      pulsePhase: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.baseRadius = Math.random() * 1.8 + 1.2;

        // Color distribution: ~50% Terracotta, ~20% Gold, ~20% Cobalt, ~10% Sage
        const rand = Math.random();
        if (rand < 0.5) {
          this.color = colorPalette[0]; // Terracotta
        } else if (rand < 0.72) {
          this.color = colorPalette[1]; // Gold
        } else if (rand < 0.9) {
          this.color = colorPalette[2]; // Cobalt
        } else {
          this.color = colorPalette[3]; // Sage
        }

        // ~25% of particles are pulsing beacons (pulsars)
        this.isPulsar = Math.random() < 0.25;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently off viewport edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Advance pulse phase
        this.pulsePhase += this.pulseSpeed;

        // Smooth mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.8;
            this.y -= (dy / dist) * force * 2.8;
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();

        let currentRadius = this.baseRadius;
        if (this.isPulsar) {
          // Sine-wave breathing pulse
          const pulseFactor = (Math.sin(this.pulsePhase) + 1) / 2; // 0 to 1
          currentRadius = this.baseRadius + pulseFactor * 1.4;

          // Glowing aura halo
          c.shadowBlur = 12 + pulseFactor * 16;
          c.shadowColor = this.color.glow;
        } else {
          c.shadowBlur = 6;
          c.shadowColor = this.color.glow;
        }

        c.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        c.fillStyle = this.color.fill;
        c.fill();
        c.restore();
      }
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      // Scale count gracefully with screen width (40 to 65 particles)
      const count = Math.max(35, Math.min(Math.floor(width / 24), 65));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const maxDist = 135;
      const light = theme === 'pixel';

      // 1. Draw dynamic connection lines with proximity thickening
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            // Closeness ratio: 0 (far) to 1 (near collision)
            const closeness = 1 - dist / maxDist;

            // Line thickness increases non-linearly as distance decreases (0.5px -> ~2.7px)
            const lineWidth = 0.5 + closeness * closeness * 2.2;

            // Opacity scales up as nodes get closer
            const baseAlpha = light ? 0.08 : 0.12;
            const alpha = baseAlpha + closeness * (light ? 0.3 : 0.42);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            // Connect using tinted stroke
            const strokeColor = light
              ? `rgba(227, 93, 20, ${alpha.toFixed(3)})`
              : `rgba(227, 93, 20, ${alpha.toFixed(3)})`;

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;

            // If nodes are very close (dist < 50px), add synaptic energy glow
            if (dist < 50 && !light) {
              ctx.shadowBlur = 5;
              ctx.shadowColor = 'rgba(227, 93, 20, 0.45)';
            }

            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 2. Update and draw nodes
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div
      className="ambient-canvas-wrapper"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
