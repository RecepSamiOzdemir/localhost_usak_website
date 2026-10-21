import React from 'react';
import type { SponsorTier } from '../../types/sponsor';

interface SponsorLogoProps {
  src: string;
  name: string;
  // true: sayfanın üstündeki kritik logo (hemen yükle, yüksek öncelik); false: lazy
  priority?: boolean;
}

// Logo kutusu: yüklenene kadar shimmer, yüklenince fade-in; hata/boş src'de baş harf rozeti.
export const SponsorLogo: React.FC<SponsorLogoProps> = ({ src, name, priority = false }) => {
  // Durumu src'ye bağlıyoruz; src değişince eski durum otomatik geçersiz olur
  const [loadedSrc, setLoadedSrc] = React.useState('');
  const [failedSrc, setFailedSrc] = React.useState('');

  const failed = !src || failedSrc === src;
  const loaded = loadedSrc === src;

  // Görsel tarayıcı önbelleğinden anında geldiyse onLoad kaçabilir; ref ile yakala
  const imgRef = React.useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete && img.naturalWidth > 0) setLoadedSrc(src);
    },
    [src]
  );

  return (
    <div className={`sponsor-card-logo-box ${!failed && !loaded ? 'is-logo-loading' : ''}`.trim()}>
      {!failed ? (
        <img
          ref={imgRef}
          className={`sponsor-logo-fade ${loaded ? 'is-loaded' : ''}`.trim()}
          src={src}
          alt={name}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'var(--bg-elevated)',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
          }}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
};

// Gerçek kartla aynı tier sınıflarını kullanır, böylece yükseklikler birebir aynı olur (layout kayması yok)
// grid=false: anasayfadaki sabit genişlikli kartlarla aynı görünüm (sponsor-grid-card genişliği olmadan)
export const SponsorCardSkeleton: React.FC<{ tier: SponsorTier; grid?: boolean }> = ({ tier, grid = true }) => (
  <div
    className={`sponsor-card-block tier-size-${tier} ${grid ? 'sponsor-grid-card' : ''} sponsor-skeleton`}
    aria-hidden="true"
  >
    <div className="sponsor-card-logo-box is-logo-loading" />
    <div className="sponsor-card-footer">
      <span className="sponsor-skeleton-bar" style={{ width: '55%' }} />
      <span className="sponsor-skeleton-bar" style={{ width: '35%', height: '10px' }} />
    </div>
  </div>
);
