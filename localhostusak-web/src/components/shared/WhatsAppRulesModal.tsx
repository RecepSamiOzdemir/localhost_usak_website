import React, { useState, useEffect, useRef } from 'react';
import { Users, ShieldAlert, MessageSquare, Compass, Handshake, ScrollText, Check } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export interface WhatsAppRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetUrl: string;
  groupLabel?: string;
}

interface RuleItem {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
  isHighlight?: boolean;
}

const RULES: RuleItem[] = [
  {
    id: 1,
    title: 'Topluluğa Saygı',
    desc: 'Tüm üyelerin kendini rahat hissettiği, güvenli ve destekleyici bir ortam için birbirimize saygılı olalım.',
    icon: <Users size={20} />,
    badge: '01',
  },
  {
    id: 2,
    title: 'Özelden Toplu Mesaj',
    desc: 'Topluluktaki üyelere toplu şekilde özelden ulaşıp iş, proje veya müşteri toplamaya çalışılması kesinlikle doğru bulmadığımız bir yaklaşımdır.',
    icon: <ShieldAlert size={20} />,
    badge: '02 // ÖNEMLİ',
  },
  {
    id: 3,
    title: 'Paylaşımlar İçin Doğru Grup',
    desc: 'Proje, iş birliği veya ekip ihtiyacı varsa lütfen ilgili grubumuzda paylaşın.',
    icon: <MessageSquare size={20} />,
    badge: '03',
  },
  {
    id: 4,
    title: 'Yönlendirme Bizden',
    desc: 'Gerekli durumlarda doğru kişileri ve ekipleri biz yönlendireceğiz.',
    icon: <Compass size={20} />,
    badge: '04',
  },
  {
    id: 5,
    title: 'Birlikte Daha Güçlüyüz',
    desc: 'Üyelerimizin rahatlığı ve topluluğun güven ortamı bizim için önemli. Birlikte çalışalım, birlikte üretelim ve fırsatları şeffaf şekilde birlikte büyütelim.',
    icon: <Handshake size={20} />,
    badge: '05 // DAYANIŞMA',
    isHighlight: true,
  },
];

export const WhatsAppRulesModal: React.FC<WhatsAppRulesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  groupLabel,
}) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToEnd(false);
      setScrollPercent(0);
      setIsChecked(false);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Check if content is already short enough to not need scrolling
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          const { scrollHeight, clientHeight } = scrollContainerRef.current;
          if (scrollHeight <= clientHeight + 15) {
            setHasScrolledToEnd(true);
            setScrollPercent(100);
          }
        }
      }, 150);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sentinel IntersectionObserver for bottom detection
  useEffect(() => {
    if (!isOpen || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledToEnd(true);
          setScrollPercent(100);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.8,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  // OnScroll listener for smooth progress bar and fallback bottom detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollPercent(100);
      setHasScrolledToEnd(true);
      return;
    }

    const currentPercent = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
    setScrollPercent(currentPercent);

    if (scrollTop + clientHeight >= scrollHeight - 25) {
      setHasScrolledToEnd(true);
    }
  };

  const handleScrollToBottomClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="wa-rules-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-rules-title"
    >
      <div
        className="wa-rules-modal-card card circuit-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HUD Corners */}
        <span className="hud-corner-tl" aria-hidden="true" />
        <span className="hud-corner-tr" aria-hidden="true" />
        <span className="hud-corner-bl" aria-hidden="true" />
        <span className="hud-corner-br" aria-hidden="true" />

        {/* Modal Header */}
        <div className="wa-rules-header">
          <div className="wa-rules-header-meta">
            <span className="wa-rules-tag">// TOPLULUK HATIRLATMASI</span>
            {groupLabel && <span className="wa-rules-group-badge">{groupLabel}</span>}
          </div>

          <div className="wa-rules-title-row">
            <h2 id="wa-rules-title" className="wa-rules-title">
              Daha Güçlü Bir <span className="gradient-text-orange">Topluluk İçin</span>
            </h2>
            <button
              type="button"
              className="wa-rules-close-btn"
              onClick={onClose}
              aria-label="Kapat"
              title="Kapat (ESC)"
            >
              ✕
            </button>
          </div>

          <p className="wa-rules-subtitle">
            LocalhostUsak'ta amacımız; birbirimizi tanımak, birlikte üretmek, proje geliştirmek ve
            oluşan fırsatları topluluk içinde şeffaf şekilde değerlendirmektir.
          </p>

          {/* Reading progress track */}
          <div className="wa-rules-progress-track" title={`Okuma İlerlemesi: %${scrollPercent}`}>
            <div
              className="wa-rules-progress-bar"
              style={{ width: `${scrollPercent}%` }}
              role="progressbar"
              aria-valuenow={scrollPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Scrollable Rules Container */}
        <div
          className="wa-rules-scroll-area"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Topluluk kuralları listesi"
        >
          <div className="wa-rules-grid">
            {RULES.map((rule) => (
              <div
                key={rule.id}
                className={`wa-rule-card ${rule.isHighlight ? 'wa-rule-card-highlight' : ''}`}
              >
                <div className="wa-rule-card-header">
                  <div className="wa-rule-icon-wrapper">
                    <span className="wa-rule-icon">{rule.icon}</span>
                  </div>
                  <span className="wa-rule-badge">{rule.badge}</span>
                </div>
                <h3 className="wa-rule-item-title">{rule.title}</h3>
                <p className="wa-rule-item-desc">{rule.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Motto Quote */}
          <div className="wa-rules-motto">
            <div className="wa-rules-motto-callout">"Daha iyi bir Uşak için Birlikte."</div>
            <div className="wa-rules-motto-triad">
              <span>FİKİRLER BULUŞUR</span>
              <span className="dot">•</span>
              <span>İŞLER BÜYÜR</span>
              <span className="dot">•</span>
              <span>TOPLULUK GÜÇLENİR</span>
            </div>
          </div>

          {/* Invisible sentinel element for scroll completion observer */}
          <div ref={sentinelRef} className="wa-rules-sentinel" aria-hidden="true" />
        </div>

        {/* Scroll helper indicator when not yet scrolled */}
        {!hasScrolledToEnd && (
          <button
            type="button"
            className="wa-rules-scroll-indicator"
            onClick={handleScrollToBottomClick}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ScrollText size={16} />
              <span>Tüm kuralları görmek için aşağı kaydırın</span>
            </span>
            <span className="bounce-arrow">↓</span>
          </button>
        )}

        {/* Modal Footer / Acceptance Control */}
        <div className="wa-rules-footer">
          <div
            className={`wa-rules-checkbox-container ${!hasScrolledToEnd ? 'locked' : ''} ${
              isChecked ? 'checked' : ''
            }`}
          >
            <label className="wa-rules-checkbox-label" htmlFor="wa-rules-agree-checkbox">
              <input
                type="checkbox"
                id="wa-rules-agree-checkbox"
                disabled={!hasScrolledToEnd}
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="wa-rules-checkbox-input"
              />
              <span className="wa-rules-checkbox-custom" aria-hidden="true" />
              <div className="wa-rules-checkbox-text">
                <strong>Kuralları okudum, anladım ve kabul ediyorum.</strong>
                {!hasScrolledToEnd ? (
                  <span className="wa-rules-unlock-hint">
                    (Onaylamak için lütfen kuralları sonuna kadar okuyup kaydırın)
                  </span>
                ) : (
                  <span className="wa-rules-unlocked-hint" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} />
                    <span>Tüm kuralları incelediniz, kutuyu işaretleyerek devam edebilirsiniz.</span>
                  </span>
                )}
              </div>
            </label>
          </div>

          <div className="wa-rules-actions">
            <button
              type="button"
              className="btn btn-secondary wa-rules-cancel-btn"
              onClick={onClose}
            >
              <span>Vazgeç</span>
            </button>

            <button
              type="button"
              className="btn btn-whatsapp wa-rules-confirm-btn"
              disabled={!isChecked}
              onClick={onConfirm}
              id="wa-rules-confirm-button"
            >
              <WhatsAppIcon size={18} />
              <span>Onayla ve Gruba Katıl</span>
            </button>
          </div>

          <div
            style={{
              marginTop: '0.65rem',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
            }}
          >
            <span>Topluluğumuza katılarak </span>
            <a
              href="/kvkk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent-primary)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              KVKK Aydınlatma Metni ve Muvafakatnamesi
            </a>
            <span> şartlarını kabul etmiş sayılırsınız.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppRulesModal;
