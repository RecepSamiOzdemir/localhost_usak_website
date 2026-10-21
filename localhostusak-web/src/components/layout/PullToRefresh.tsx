import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../../styles/pull-to-refresh.css';

// Strict, mathematically bounded constants (cannot go down the page)
const HIDDEN_Y = -60;
const MAX_Y = 22;
const TRIGGER_Y = 10;

// Detect touch-capable devices (mobile/tablet only)
const isTouchDevice = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches;

// Inner component — sadece touch cihazlarda mount edilir
const PullToRefreshInner: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // DOM Refs for 120 FPS hardware compositing
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<SVGSVGElement | null>(null);

  // Motion physics
  const targetY = useRef<number>(HIDDEN_Y);
  const currentY = useRef<number>(HIDDEN_Y);
  const isRefreshingRef = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);
  const accumulatedDelta = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  // Ensure navbar stays completely stationary
  useEffect(() => {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.style.transform = '';
      nav.style.transition = '';
    }
  }, []);

  // Smooth 120 FPS RAF physics interpolation loop
  useEffect(() => {
    let active = true;

    const animate = () => {
      if (!active) return;

      // Spring lerp
      const diff = targetY.current - currentY.current;
      currentY.current += diff * 0.2;

      if (wrapperRef.current && iconRef.current) {
        const y = currentY.current;

        // Bounded strictly between HIDDEN_Y and MAX_Y
        wrapperRef.current.style.transform = `translate3d(-50%, ${y}px, 0)`;

        // Opacity smoothly fades in between -40px and 0px
        const opacity = Math.min(1, Math.max(0, (y - HIDDEN_Y) / 45));
        wrapperRef.current.style.opacity = `${opacity}`;

        // Arrow rotates proportionally up to 360deg
        if (!isRefreshingRef.current) {
          const progress = Math.min(1, Math.max(0, (y - HIDDEN_Y) / (TRIGGER_Y - HIDDEN_Y)));
          iconRef.current.style.transform = `rotate(${progress * 300}deg)`;
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const triggerRefresh = useCallback(() => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    setIsReady(true);

    // Settle at natural resting position
    targetY.current = 14;

    // Instant, snappy reload (no artificial waiting)
    setTimeout(() => {
      try {
        window.location.reload();
      } catch {
        window.location.href = window.location.href;
      }
    }, 50);
  }, []);

  const handleRelease = useCallback(() => {
    if (isRefreshingRef.current) return;
    accumulatedDelta.current = 0;

    if (currentY.current >= TRIGGER_Y || targetY.current >= TRIGGER_Y) {
      triggerRefresh();
    } else {
      // Retract smoothly behind navbar
      targetY.current = HIDDEN_Y;
      setIsReady(false);
    }
  }, [triggerRefresh]);

  // Standard asymptotic saturation formula: Mathematically capped at MAX_Y
  const updateDelta = useCallback((delta: number) => {
    if (isRefreshingRef.current) return;

    if (delta <= 0) {
      targetY.current = HIDDEN_Y;
      setIsReady(false);
    } else {
      // Formula: progress goes smoothly from 0 to 1; target goes from HIDDEN_Y to MAX_Y (22px max)
      const progress = 1 - Math.exp(-Math.abs(delta) / 100);
      const y = HIDDEN_Y + progress * (MAX_Y - HIDDEN_Y);
      targetY.current = y;
      setIsReady(y >= TRIGGER_Y);
    }
  }, []);

  // Touch Listeners (Mobile / iPad only)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !isRefreshingRef.current) {
        touchStartY.current = e.touches[0].clientY;
      } else {
        touchStartY.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || isRefreshingRef.current) return;
      if (window.scrollY > 0) {
        touchStartY.current = null;
        updateDelta(0);
        return;
      }

      const diff = e.touches[0].clientY - touchStartY.current;
      if (diff > 0) {
        if (e.cancelable) e.preventDefault();
        updateDelta(diff * 0.7);
      } else {
        updateDelta(0);
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      handleRelease();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [updateDelta, handleRelease]);

  // Wheel / Trackpad Listeners — sadece mobil cihazlarda çalışır
  // (Bu bileşen zaten isTouchDevice() kontrolünden sonra mount edilir)
  useEffect(() => {
    const gestureTimer = { current: null as ReturnType<typeof setTimeout> | null };

    const handleWheel = (e: WheelEvent) => {
      if (isRefreshingRef.current) return;

      // Sayfada aşağı kaydırılmışsa native scroll çalışsın
      if (window.scrollY > 0) {
        if (targetY.current > HIDDEN_Y) {
          targetY.current = HIDDEN_Y;
          accumulatedDelta.current = 0;
          setIsReady(false);
        }
        return;
      }

      // Aşağı scroll yapılıyorsa native scroll çalışsın
      if (e.deltaY > 0) {
        if (targetY.current > HIDDEN_Y) {
          targetY.current = HIDDEN_Y;
          accumulatedDelta.current = 0;
          setIsReady(false);
        }
        return;
      }

      // Yukarı çekiliyorsa (deltaY < 0) — pull-to-refresh tetikle
      if (e.deltaY < 0) {
        accumulatedDelta.current += Math.abs(e.deltaY) * 0.25;
        updateDelta(accumulatedDelta.current);

        if (gestureTimer.current) clearTimeout(gestureTimer.current);
        gestureTimer.current = setTimeout(() => {
          handleRelease();
        }, 100);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (gestureTimer.current) clearTimeout(gestureTimer.current);
    };
  }, [updateDelta, handleRelease]);

  return (
    <div
      ref={wrapperRef}
      className="ptr-badge-wrapper"
      aria-label="Sayfayı Yenile"
    >
      <div
        className={`ptr-badge ${isRefreshing ? 'refreshing' : isReady ? 'ready' : ''}`}
      >
        <svg
          ref={iconRef}
          viewBox="0 0 24 24"
          className="ptr-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <path d="M21 3v5h-5" />
        </svg>
      </div>
    </div>
  );
};

// Wrapper — desktop'ta (pointer: fine) hiçbir şey render etmez
export const PullToRefresh: React.FC = () => {
  if (!isTouchDevice()) return null;
  return <PullToRefreshInner />;
};
