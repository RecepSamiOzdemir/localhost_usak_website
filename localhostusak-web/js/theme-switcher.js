/* ==========================================================================
   Theme Switcher & State Management
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'localhostusak_theme';
  const html = document.documentElement;

  // Initialize theme from storage or default to modern
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'modern';
  setTheme(savedTheme, false);

  function setTheme(theme, playSound = true) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update UI elements
    updateThemeControls(theme);

    // Play sound if requested
    if (playSound && window.soundFX) {
      if (theme === 'pixel') {
        window.soundFX.playVictory();
      } else {
        window.soundFX.playReboot();
      }
    }

    // Dispatch event for other components (e.g. background canvas)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  function updateThemeControls(theme) {
    const toggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');
    const restoreBtns = document.querySelectorAll('[data-action="system-restore"]');
    const themeLabel = document.getElementById('theme-label');
    const themeIcon = document.getElementById('theme-icon');

    if (theme === 'pixel') {
      if (themeLabel) themeLabel.textContent = '8-Bit Retro';
      if (themeIcon) themeIcon.textContent = '🕹️';
      restoreBtns.forEach(btn => btn.style.display = 'inline-flex');
    } else {
      if (themeLabel) themeLabel.textContent = 'Cyber HUD';
      if (themeIcon) themeIcon.textContent = '⚡';
      restoreBtns.forEach(btn => btn.style.display = 'none');
    }
  }

  // Toggle Function
  window.toggleTheme = function () {
    const current = html.getAttribute('data-theme') || 'modern';
    const next = current === 'modern' ? 'pixel' : 'modern';
    setTheme(next, true);
  };

  // Restore to Modern Function
  window.systemRestore = function () {
    const body = document.body;
    body.classList.add('crt-reboot-effect');

    const toast = document.getElementById('level-unlocked-toast');
    if (toast) toast.classList.remove('show');

    if (window.soundFX) window.soundFX.playReboot();

    setTimeout(() => {
      setTheme('modern', false);
      body.classList.remove('crt-reboot-effect');
      // Reset Reality Breach state if breached
      if (window.realityBreach) {
        window.realityBreach.reset();
      }
    }, 400);
  };

  // Expose setter
  window.setAppTheme = setTheme;

  // Event Listeners on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleTheme();
      });
    });

    document.querySelectorAll('[data-action="system-restore"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.systemRestore();
      });
    });

    updateThemeControls(html.getAttribute('data-theme') || 'modern');
  });
})();
