import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { soundFX } from '../utils/audioFx';

type Theme = 'modern' | 'pixel';

interface ThemeContextType {
  theme: Theme;
  toastTheme: Theme;
  isCracking: boolean;
  breachHits: number;
  breachStatusText: string;
  isUnlockedToastVisible: boolean;
  hasBreached: boolean;
  toggleTheme: (x?: number, y?: number) => void;
  systemRestore: () => void;
  triggerBreach: (x?: number, y?: number) => void;
  closeToast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'localhostusak_theme';
const MANUAL_OVERRIDE_KEY = 'localhostusak_theme_manual';
const BREACHED_STORAGE_KEY = 'localhostusak_reality_breached';

const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'modern' : 'pixel';
  }
  return 'modern';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Clean up legacy localStorage override that was locking previous builds to dark
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(MANUAL_OVERRIDE_KEY);
      } catch {}

      const manualOverride = sessionStorage.getItem(MANUAL_OVERRIDE_KEY);
      const savedTheme = sessionStorage.getItem(STORAGE_KEY) as Theme | null;
      if (manualOverride === 'true' && (savedTheme === 'pixel' || savedTheme === 'modern')) {
        return savedTheme;
      }

      return getSystemTheme();
    }
    return 'modern';
  });

  const [isCracking, setIsCracking] = useState<boolean>(false);
  const [breachHits, setBreachHits] = useState<number>(0);
  const [breachStatusText, setBreachStatusText] = useState<string>('⚡ Reality Fracture: 100%');
  const [isUnlockedToastVisible, setIsUnlockedToastVisible] = useState<boolean>(false);
  const [toastTheme, setToastTheme] = useState<Theme>('pixel');
  const [hasBreached, setHasBreached] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(BREACHED_STORAGE_KEY) === 'true';
    }
    return false;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize with documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem(STORAGE_KEY, theme);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }, [theme]);

  // Listen to live system theme changes (e.g. user switches macOS settings or browser scheme)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // User changed OS theme: clear session override and adopt new OS preference immediately
      sessionStorage.removeItem(MANUAL_OVERRIDE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      const nextTheme: Theme = e.matches ? 'modern' : 'pixel';
      setThemeState(nextTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Setup fracture canvas
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'breach-canvas-overlay';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, []);

  const spawnFloatingEmojis = (x: number, y: number, emojis: string[], count: number) => {
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
  };

  const drawCracks = (startX: number, startY: number, branches: number, segments: number, length: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#00E5FF';
    ctx.shadowColor = '#FF6600';
    ctx.shadowBlur = 10;

    for (let i = 0; i < branches; i++) {
      const angle = ((Math.PI * 2) / branches) * i + (Math.random() - 0.5) * 0.5;
      let currX = startX;
      let currY = startY;

      ctx.beginPath();
      ctx.moveTo(currX, currY);

      for (let s = 0; s < segments; s++) {
        const segLen = length / segments;
        const segAngle = angle + (Math.random() - 0.5) * 0.9;
        currX += Math.cos(segAngle) * segLen;
        currY += Math.sin(segAngle) * segLen;
        ctx.lineTo(currX, currY);

        if (s > 2 && Math.random() > 0.6) {
          const subAngle = segAngle + (Math.random() > 0.5 ? 0.7 : -0.7);
          const subLen = segLen * 1.5;
          ctx.moveTo(currX, currY);
          ctx.lineTo(currX + Math.cos(subAngle) * subLen, currY + Math.sin(subAngle) * subLen);
          ctx.moveTo(currX, currY);
        }
      }
      ctx.stroke();
    }
  };

  const applyScreenShake = (className: string) => {
    document.body.classList.remove('shake-level-1', 'shake-level-2');
    void document.body.offsetWidth; // Force reflow
    document.body.classList.add(className);
    setTimeout(() => {
      document.body.classList.remove(className);
    }, 600);
  };

  const systemRestore = useCallback(() => {
    sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
    document.body.classList.add('crt-reboot-effect');
    soundFX.playReboot();
    setIsUnlockedToastVisible(false);

    setTimeout(() => {
      setThemeState('modern');
      document.body.classList.remove('crt-reboot-effect');
      setBreachHits(0);
      setBreachStatusText('⚡ Reality Fracture: 100%');
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 350);
  }, []);

  const toggleTheme = useCallback(
    (x?: number, y?: number) => {
      const posX = x ?? (typeof window !== 'undefined' ? window.innerWidth - 120 : 800);
      const posY = y ?? 38;
      const targetTheme: Theme = theme === 'modern' ? 'pixel' : 'modern';

      // If the 3-step reality breach animation has ALREADY been played,
      // subsequent theme switches are smooth, instant, and classic
      if (hasBreached) {
        sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
        sessionStorage.setItem(STORAGE_KEY, targetTheme);
        soundFX.playBlip();
        setThemeState(targetTheme);
        return;
      }

      // FIRST-TIME REALITY BREACH: Theme-agnostic 3-step fracture sequence!
      // Works identically whether user starts in light (pixel) or dark (modern) mode
      const nextHit = breachHits + 1;

      if (nextHit === 1) {
        // Step 1: Initial Fracture
        setBreachHits(1);
        setBreachStatusText('💥 Reality Fracture: 33%');
        applyScreenShake('shake-level-1');
        soundFX.playCrack(0);
        drawCracks(posX, posY, 4, 6, 140);
        spawnFloatingEmojis(posX, posY, ['⚡', '✨', theme === 'modern' ? '🌙' : '☀️'], 5);
      } else if (nextHit === 2) {
        // Step 2: Critical Fracture
        setBreachHits(2);
        setBreachStatusText('🚨 Reality Fracture: 66% [CRITICAL]');
        applyScreenShake('shake-level-2');
        soundFX.playCrack(1);
        drawCracks(posX, posY, 7, 8, 260);
        spawnFloatingEmojis(posX, posY, ['⚡', '🔥', '✨', '🧡'], 8);
      } else {
        // Step 3: Full Dimension Breach & Theme Transformation!
        setIsCracking(true);
        sessionStorage.setItem(MANUAL_OVERRIDE_KEY, 'true');
        sessionStorage.setItem(STORAGE_KEY, targetTheme);
        sessionStorage.setItem(BREACHED_STORAGE_KEY, 'true');
        setHasBreached(true);

        applyScreenShake('shake-level-2');
        soundFX.playCrack(2);
        drawCracks(posX, posY, 12, 12, 450);
        spawnFloatingEmojis(posX, posY, ['✨', '⚡', '🧡', '☕', '☀️', '🌙'], 18);

        const flash = document.createElement('div');
        flash.className = 'breach-flash active';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);

        setTimeout(() => {
          setThemeState(targetTheme);
          setToastTheme(targetTheme);
          setIsUnlockedToastVisible(true);
          setTimeout(() => setIsUnlockedToastVisible(false), 4500);

          if (targetTheme === 'pixel') {
            soundFX.playVictory();
          } else {
            soundFX.playReboot();
          }
          setBreachHits(0);
          setBreachStatusText('⚡ Reality Fracture: 100%');
        }, 180);

        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          setIsCracking(false);
        }, 600);
      }
    },
    [theme, breachHits, hasBreached]
  );

  // Auto-heal canvas cracks if left unclicked for 12 seconds
  useEffect(() => {
    if (breachHits > 0) {
      const timer = setTimeout(() => {
        setBreachHits(0);
        setBreachStatusText('⚡ Reality Fracture: 100%');
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [breachHits]);

  const triggerBreach = useCallback(
    (x?: number, y?: number) => {
      toggleTheme(x, y);
    },
    [toggleTheme]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toastTheme,
        isCracking,
        breachHits,
        breachStatusText,
        isUnlockedToastVisible,
        hasBreached,
        toggleTheme,
        systemRestore,
        triggerBreach,
        closeToast: () => setIsUnlockedToastVisible(false),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

