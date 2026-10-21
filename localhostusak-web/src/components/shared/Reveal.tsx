import React from 'react';
import { useReveal } from '../../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  // Sıralı (stagger) giriş için milisaniye cinsinden gecikme
  delay?: number;
  className?: string;
}

// Mevcut `.reveal` / `.is-revealed` sınıflarını kullanan sarmalayıcı.
// Animasyon sarmalayıcıda kalır; çocuğun kendi hover geçişleri bozulmaz.
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '' }) => {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${revealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
