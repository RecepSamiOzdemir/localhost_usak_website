/* ==========================================================================
   Scroll Effects, Interactive Background Canvas & Stat Counters
   ========================================================================== */

(function () {
  // --------------------------------------------------------------------------
  // 1. Scroll Reveal Observer
  // --------------------------------------------------------------------------
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
    // Immediately reveal hero elements
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 2. Animated Number Counters
  // --------------------------------------------------------------------------
  function setupStatCounters() {
    const statCards = document.querySelectorAll('.stat-number');
    let started = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          statCards.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || '0', 10);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 1800;
            const startTime = performance.now();

            function updateNumber(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out expo
              const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.floor(easeOut * target);

              stat.textContent = `${prefix}${currentVal}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              } else {
                stat.textContent = `${prefix}${target}${suffix}`;
              }
            }

            requestAnimationFrame(updateNumber);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 3. Interactive Hero Canvas (Constellation & Cyber Nodes)
  // --------------------------------------------------------------------------
  function setupHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    let mouse = { x: null, y: null, radius: 140 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
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

        // Mouse interaction
        if (mouse.x != null) {
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

      draw(isPixel) {
        ctx.beginPath();
        if (isPixel) {
          // Draw small pixel squares in retro mode
          ctx.fillStyle = this.isBlue ? '#3A86FF' : '#EE6C19';
          ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        } else {
          // Glowing cyber nodes in modern mode
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.isBlue ? '#00E5FF' : '#FF6600';
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.isBlue ? '#00E5FF' : '#FF6600';
          ctx.fill();
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const isPixel = document.documentElement.getAttribute('data-theme') === 'pixel';

      // Connect lines
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

      particles.forEach(p => {
        p.update();
        p.draw(isPixel);
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
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
    });

    resize();
    animate();
  }

  // --------------------------------------------------------------------------
  // 4. Navbar Scroll Shadow Effect
  // --------------------------------------------------------------------------
  function setupNavbarScroll() {
    const nav = document.querySelector('.navbar-wrapper');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });
  }

  // --------------------------------------------------------------------------
  // DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
    setupStatCounters();
    setupHeroCanvas();
    setupNavbarScroll();
  });
})();
