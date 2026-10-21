import React from 'react';
import { ArrowRight, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SponsorItem } from '../../types/sponsor';
import { fetchSponsors, getCachedSponsors } from '../../services/api';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import { EmptyState } from '../shared/EmptyState';
import { Reveal, SponsorLogo, SponsorCardSkeleton } from '../shared';

export const SponsorsSection: React.FC = () => {
  const { items: sponsors, isLoading, error, retry } = useCmsCollection<SponsorItem>(fetchSponsors, getCachedSponsors());

  // Duplicate sponsors for seamless marquee looping
  const goldSponsors = React.useMemo(() => sponsors.filter(s => (s.tier || 'community') === 'gold'), [sponsors]);

  const marqueeItems = React.useMemo(() => {
    if (!goldSponsors || goldSponsors.length === 0) return [];
    if (goldSponsors.length < 6) {
      return [...goldSponsors, ...goldSponsors, ...goldSponsors, ...goldSponsors];
    }
    return [...goldSponsors, ...goldSponsors];
  }, [goldSponsors]);

  return (
    <section className="section sponsors-section" id="sponsors" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag">DESTEKÇİLERİMİZ & SPONSORLAR</span>
          <h2 className="section-title">Topluluğumuza Güç Katanlar</h2>
          <p className="section-desc">
            Uşak teknoloji, yazılım ve mühendislik ekosisteminin büyümesine katkı sağlayan,
            etkinliklerimizi ve projelerimizi destekleyen değerli paydaşlarımız.
          </p>
        </div>

        {isLoading ? (
          // Gerçek kartla aynı yükseklikte skeleton: yükleme bitince layout kaymaz
          <div
            role="status"
            aria-busy="true"
            aria-label="Destekçiler yükleniyor"
            style={{ display: 'flex', justifyContent: 'center', margin: '1rem auto 2rem auto' }}
          >
            <SponsorCardSkeleton tier="gold" grid={false} />
          </div>
        ) : error ? (
          <EmptyState
            icon={<AlertTriangle size={40} style={{ color: 'var(--accent-primary)' }} />}
            title="Destekçilere Ulaşılamadı"
            description="Destekçi bilgileri şu anda yüklenemiyor."
            actionText="Tekrar Dene"
            onAction={retry}
          />
        ) : sponsors.length > 0 ? (
          <div>
            {/* Ana sayfada sadece ALTIN sponsorlar gösterilir */}
            {goldSponsors.length === 0 ? (
              // Altın sponsor yoksa sadece butonu göster
              <div style={{ textAlign: 'center', margin: '1rem 0 2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Sponsorlarımızı keşfedin.</p>
              </div>
            ) : goldSponsors.length <= 3 ? (
              <div
                className="sponsors-static-row"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1.75rem',
                  flexWrap: 'wrap',
                  margin: '1rem auto 2rem auto',
                  maxWidth: '960px',
                }}
              >
                {goldSponsors.map((sponsor, index) => {
                  const tier = 'gold';
                  const tierSizeClass = `tier-size-${tier}`;
                  return (
                    <Reveal key={sponsor.id} delay={index * 90}>
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`sponsor-card-block ${tierSizeClass}`}
                        title={`${sponsor.name} web sitesini ziyaret et`}
                        style={{ transform: 'none' }}
                      >
                        <SponsorLogo src={sponsor.logoUrl} name={sponsor.name} />

                        <div className="sponsor-card-footer">
                          <span className="sponsor-card-name">{sponsor.name}</span>
                          <span className="tier-badge tier-gold-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem' }}>
                            Altın Sponsor
                          </span>
                        </div>
                      </a>
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              /* Infinite Horizontal Logo Marquee when sponsor count > 3 */
              <div className="marquee-wrapper" aria-label="Sponsorlar Kayan Şerit">
                <div className="marquee-track">
                  {marqueeItems.map((sponsor, idx) => {
                    const tier = sponsor.tier || 'community';
                    const tierSizeClass = `tier-size-${tier}`;
                    return (
                      <a
                        key={`${sponsor.id}-${idx}`}
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`sponsor-card-block ${tierSizeClass}`}
                        title={`${sponsor.name} (${tier.toUpperCase()}) web sitesini ziyaret et`}
                      >
                        <SponsorLogo src={sponsor.logoUrl} name={sponsor.name} />

                        <div className="sponsor-card-footer">
                          <span className="sponsor-card-name">{sponsor.name}</span>
                          {tier === 'gold' && (
                            <span className="tier-badge tier-gold-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem' }}>
                              Altın Sponsor
                            </span>
                          )}
                          {tier === 'silver' && (
                            <span className="tier-badge tier-silver-badge" style={{ fontSize: '0.66rem', padding: '0.15rem 0.55rem' }}>
                              Gümüş Sponsor
                            </span>
                          )}
                          {tier === 'bronze' && (
                            <span className="tier-badge tier-bronze-badge" style={{ fontSize: '0.64rem', padding: '0.15rem 0.5rem' }}>
                              Bronz Sponsor
                            </span>
                          )}
                          {tier === 'community' && (
                            <span className="sponsor-card-sub">
                              Destekçi ↗
                            </span>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Link to Dedicated /sponsorlar page */}
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link
                to="/sponsorlar"
                className="btn btn-secondary"
                id="btn-all-sponsors"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <span>Tüm Sponsorlarımız & Sponsorluk Paketleri</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="sponsors-empty-box card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
            <div className="sponsors-empty-icon" style={{ marginBottom: '1rem' }}>
              <Users size={36} style={{ color: 'var(--accent-primary)', margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Topluluğumuza İlk Sponsor Siz Olun
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Uşak'taki teknoloji üreticilerine ve genç mühendislere destek olmak için bizimle iletişime geçin.
            </p>
            <Link to="/sponsorlar" className="btn btn-primary btn-sm">
              <span>Sponsorluk Detayları</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
