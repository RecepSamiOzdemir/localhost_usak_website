import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  paragraphs: string[];
  /** Kullanıcı "Okudum ve onaylıyorum"a bastı */
  onConfirm: () => void;
  /** Vazgeç / Kapat / Esc / arka plana tıklama: onay verilmez */
  onCancel: () => void;
}

// Pay: sona "ulaşıldı" sayılması için kalan en fazla piksel (kesirli kaydırma değerleri için)
const END_TOLERANCE_PX = 4;

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Aydınlatma metni pop-up'ı. "Okudum ve onaylıyorum" metnin sonuna kadar kaydırılınca etkinleşir.
// Kaydırma gerekmiyorsa (metin sığıyorsa) düğme baştan etkindir. Odak modal içinde kilitlidir (Tab döngüsü),
// Esc = vazgeç. document.body'ye portal edilir: atası `.card` backdrop-filter kullandığı için `position: fixed`
// ata kutusuna göre konumlanırdı.
export const PrivacyModal: React.FC<PrivacyModalProps> = ({ paragraphs, onConfirm, onCancel }) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const hintId = `${uid}-hint`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  // Fare, klavye, dokunma ve ekran okuyucu kaydırması aynı `scroll` olayını üretir; içerik boyutu
  // değişince (yeniden boyutlandırma, yazı tipi) de yeniden ölçülür.
  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= END_TOLERANCE_PX) setReachedEnd(true);
  }, []);

  useEffect(() => {
    measure(); // metin ekrana sığıyorsa kaydırma gerekmez: düğme hemen etkin
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  // Arka plan kaydırması kilitlenir; ilk odak, klavyeyle kaydırabilmek için metin alanına verilir.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
      return;
    }
    if (e.key !== 'Tab') return;
    // Odak tuzağı: Tab/Shift+Tab yalnızca modal içinde döner
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="application-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        ref={dialogRef}
        className="application-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        onKeyDown={handleKeyDown}
      >
        <div className="application-modal-head">
          <h3 id={titleId}>Aydınlatma Metni</h3>
          <button type="button" className="application-modal-close" onClick={onCancel} aria-label="Kapat">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="application-modal-scroll"
          tabIndex={0}
          role="region"
          aria-labelledby={titleId}
          onScroll={measure}
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p id={hintId} className="application-modal-hint">
          {reachedEnd
            ? 'Metnin sonuna ulaştınız. Onaylayabilirsiniz.'
            : 'Onay düğmesi, metnin sonuna kadar kaydırınca etkinleşir.'}
        </p>
        {/* Ekran okuyucuya durum değişikliği bildirilir */}
        <span className="application-sr-only" role="status">
          {reachedEnd ? 'Metnin sonuna ulaşıldı, Okudum ve onaylıyorum düğmesi etkin.' : ''}
        </span>

        <div className="application-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Vazgeç
          </button>
          {/* aria-disabled: düğme odaklanabilir kalır ve durumu (ve ipucunu) okutur; tıklama etkisizdir */}
          <button
            type="button"
            className="btn btn-primary"
            aria-disabled={!reachedEnd}
            onClick={() => reachedEnd && onConfirm()}
          >
            Okudum ve onaylıyorum
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
