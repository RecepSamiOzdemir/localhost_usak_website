/* ==========================================================================
   Reality Breach — 3-Hit Easter Egg Dimension Fracture Mechanic
   ========================================================================== */

class RealityBreach {
  constructor() {
    this.hits = 0;
    this.maxHits = 3;
    this.canvas = null;
    this.ctx = null;
    this.cracks = [];
    this.particles = [];
    this.animating = false;

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupCanvas();
      this.bindEvents();
    });
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'breach-canvas-overlay';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    const triggers = document.querySelectorAll('.reality-breach-trigger');
    triggers.forEach(el => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        this.triggerHit(originX, originY);
      });
    });
  }

  triggerHit(x, y) {
    if (document.documentElement.getAttribute('data-theme') === 'pixel') {
      // If already in pixel mode, just toggle back or play a cheerful blip
      if (window.soundFX) window.soundFX.playBlip();
      return;
    }

    this.hits++;
    const badge = document.getElementById('breach-status');

    if (this.hits === 1) {
      // Hit 1: 66% Integrity
      this.applyScreenShake('shake-level-1');
      if (window.soundFX) window.soundFX.playCrack(1);
      this.addCrackBranch(x, y, 6, 80);
      this.spawnFloatingEmojis(x, y, ['🧡', '☕', '⚡'], 6);
      if (badge) {
        badge.innerHTML = '⚠️ Reality Integrity: 66% <small>(Bir daha vur!)</small>';
        badge.style.color = '#FFA133';
        badge.style.borderColor = '#FFA133';
      }
    } else if (this.hits === 2) {
      // Hit 2: 33% Integrity
      this.applyScreenShake('shake-level-2');
      if (window.soundFX) window.soundFX.playCrack(2);
      this.addCrackBranch(x, y, 12, 160);
      this.spawnFloatingEmojis(x, y, ['🚨', '💻', '🧡', '👾', '✨'], 14);
      if (badge) {
        badge.innerHTML = '🚨 Reality Integrity: 33% <small>(Kritik! Son darbe...)</small>';
        badge.style.color = '#FF453A';
        badge.style.borderColor = '#FF453A';
      }
    } else if (this.hits >= 3) {
      // Hit 3: Big Bang / Reality Shatter!
      this.shatterReality(x, y);
    }
  }

  applyScreenShake(className) {
    document.body.classList.remove('shake-level-1', 'shake-level-2');
    void document.body.offsetWidth; // Force reflow
    document.body.classList.add(className);
    setTimeout(() => {
      document.body.classList.remove(className);
    }, 600);
  }

  addCrackBranch(startX, startY, segments, length) {
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 / 4) * i + (Math.random() - 0.5);
      let currX = startX;
      let currY = startY;
      const points = [{ x: currX, y: currY }];

      for (let s = 0; s < segments; s++) {
        const segLen = length / segments;
        const segAngle = angle + (Math.random() - 0.5) * 0.9;
        currX += Math.cos(segAngle) * segLen;
        currY += Math.sin(segAngle) * segLen;
        points.push({ x: currX, y: currY });
      }
      this.cracks.push({ points, alpha: 1 });
    }
    this.renderCracks();
  }

  renderCracks() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#00E5FF';
    this.ctx.shadowColor = '#FF6600';
    this.ctx.shadowBlur = 10;

    this.cracks.forEach(crack => {
      this.ctx.beginPath();
      crack.points.forEach((pt, idx) => {
        if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();
    });
  }

  spawnFloatingEmojis(x, y, emojis, count) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${Math.floor(Math.random() * 16 + 18)}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '10000';
      el.style.userSelect = 'none';
      el.style.transition = 'all 1.2s cubic-bezier(0.1, 0.9, 0.2, 1)';
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 160 + 60;
      const targetX = x + Math.cos(angle) * dist;
      const targetY = y + Math.sin(angle) * dist - 80;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${targetX - x}px, ${targetY - y}px) scale(0)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 1300);
    }
  }

  shatterReality(x, y) {
    // White Flash
    const flash = document.getElementById('breach-flash') || document.createElement('div');
    flash.className = 'breach-flash active';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.classList.remove('active');
    }, 250);

    // Switch Theme to Pixel
    if (window.setAppTheme) {
      window.setAppTheme('pixel', true);
    }

    // Clear cracks
    this.cracks = [];
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Show Level Unlocked Toast
    const toast = document.getElementById('level-unlocked-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    }

    const badge = document.getElementById('breach-status');
    if (badge) {
      badge.innerHTML = '✨ Retro Evren Aktif!';
      badge.style.color = '#3A86FF';
      badge.style.borderColor = '#3A86FF';
    }
  }

  reset() {
    this.hits = 0;
    this.cracks = [];
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const badge = document.getElementById('breach-status');
    if (badge) {
      badge.innerHTML = '⚡ Reality Fracture: 100%';
      badge.style.color = 'var(--accent-secondary)';
      badge.style.borderColor = 'var(--border-laser)';
    }
  }
}

window.realityBreach = new RealityBreach();
