import React from 'react';
import { ExternalLink, Award, Shield, Heart, Sparkles, Mail, AlertTriangle } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { WhatsAppIcon, Reveal, SponsorLogo, SponsorCardSkeleton } from '../components/shared';
import { SponsorItem } from '../types/sponsor';
import { fetchSponsors, getCachedSponsors } from '../services/api';
import { useCmsCollection } from '../hooks/useCmsCollection';
import { usePageMeta } from '../hooks/usePageMeta';
import { useLinks } from '../context/LinksContext';
import { useWhatsAppModal } from '../context/WhatsAppModalContext';
import seoPages from '../seo/pages.json';

export const SponsorsPage: React.FC = () => {
  const { items: sponsors, isLoading, error, retry } = useCmsCollection<SponsorItem>(fetchSponsors, getCachedSponsors());
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();

  usePageMeta({
    title: seoPages['/sponsorlar'].title,
    description: seoPages['/sponsorlar'].description,
  });

  const goldSponsors = React.useMemo(() => sponsors.filter((s) => s.tier === 'gold'), [sponsors]);
  const silverSponsors = React.useMemo(() => sponsors.filter((s) => s.tier === 'silver'), [sponsors]);
  const bronzeSponsors = React.useMemo(() => sponsors.filter((s) => s.tier === 'bronze'), [sponsors]);
  const communitySponsors = React.useMemo(() => sponsors.filter((s) => !s.tier || s.tier === 'community'), [sponsors]);

  // index: kart sırası; ilk kartlar sırayla (stagger) belirir, gecikme 8 kartla sınırlı
  const renderSponsorCard = (sponsor: SponsorItem, index: number) => {
    const tier = sponsor.tier || 'community';
    const tierSizeClass = `tier-size-${tier}`;

    return (
      <Reveal key={sponsor.id} delay={Math.min(index, 8) * 70}>
        <a
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`sponsor-card-block ${tierSizeClass} sponsor-grid-card`}
          title={`${sponsor.name} (${tier.toUpperCase()}) web sitesini ziyaret et`}
        >
          {/* Altın sponsor logoları sayfanın üstünde: hemen ve yüksek öncelikle yüklenir */}
          <SponsorLogo src={sponsor.logoUrl} name={sponsor.name} priority={tier === 'gold'} />

          <div className="sponsor-card-footer">
            <span className="sponsor-card-name">{sponsor.name}</span>
            <div className="sponsor-card-sub">
              <span>Web Sitesini İncele</span>
              <ExternalLink size={12} />
            </div>
          </div>
        </a>
      </Reveal>
    );
  };

  return (
    <div>
      <PageHero
        tag="// SPONSORLAR & DESTEKÇİLER"
        title="Topluluğumuza Güç Katan"
        highlightText="Değerli Sponsorlarımız"
        description="Uşak'ta teknoloji, mühendislik ve yazılım ekosistemini birlikte büyüttüğümüz kurumsal ortaklarımız ve topluluk destekçilerimiz."
      />

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {isLoading ? (
          // Gerçek sayfayla aynı grid ve tier yükseklikleri: yükleme bitince içerik kaymaz
          <div
            role="status"
            aria-busy="true"
            aria-label="Sponsorlar yükleniyor"
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '3rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
              <SponsorCardSkeleton tier="gold" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              <SponsorCardSkeleton tier="silver" />
              <SponsorCardSkeleton tier="silver" />
              <SponsorCardSkeleton tier="silver" />
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <AlertTriangle size={40} style={{ color: 'var(--accent-primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Sponsor Bilgileri Alınamadı</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
            <button onClick={retry} className="btn btn-secondary btn-sm">Tekrar Dene</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', marginTop: '3rem' }}>

            {/* 1. ALTIN SPONSORLAR (GOLD) */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <span className="tier-badge tier-gold-badge">
                  <Award size={15} /> Altın Sponsorlar ({goldSponsors.length})
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--accent-gold-border)', opacity: 0.4 }} />
              </div>

              {goldSponsors.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.75rem',
                  }}
                >
                  {goldSponsors.map(renderSponsorCard)}
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--accent-gold-border)',
                    background: 'var(--accent-gold-bg)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Altın sponsor kategorisinde yer alarak Uşak teknoloji ekosistemine en ön sıradan liderlik edin.
                  </p>
                </div>
              )}
            </section>

            {/* 2. GÜMÜŞ SPONSORLAR (SILVER) */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <span className="tier-badge tier-silver-badge">
                  <Shield size={15} /> Gümüş Sponsorlar ({silverSponsors.length})
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--accent-silver-border)', opacity: 0.4 }} />
              </div>

              {silverSponsors.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {silverSponsors.map(renderSponsorCard)}
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--accent-silver-border)',
                    background: 'var(--accent-silver-bg)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Gümüş sponsor olarak etkinliklerimizde markanızı yüzlerce mühendisle buluşturun.
                  </p>
                </div>
              )}
            </section>

            {/* 3. BRONZ SPONSORLAR (BRONZE) */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <span className="tier-badge tier-bronze-badge">
                  <Sparkles size={15} /> Bronz Sponsorlar ({bronzeSponsors.length})
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--accent-bronze-border)', opacity: 0.4 }} />
              </div>

              {bronzeSponsors.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {bronzeSponsors.map(renderSponsorCard)}
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--accent-bronze-border)',
                    background: 'var(--accent-bronze-bg)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Bronz sponsorluk ile topluluk projelerimize ve atölyelerimize doğrudan katkı sağlayın.
                  </p>
                </div>
              )}
            </section>

            {/* 4. TOPLULUK DESTEKÇİLERİ (COMMUNITY) */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <span className="tier-badge tier-community-badge">
                  <Heart size={15} /> Topluluk Destekçileri ({communitySponsors.length})
                </span>
                <div style={{ height: '1px', flex: 1, background: 'var(--border-subtle)', opacity: 0.7 }} />
              </div>

              {communitySponsors.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {communitySponsors.map(renderSponsorCard)}
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px dashed var(--border-subtle)',
                  }}
                >
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Topluluk destekçisi olarak yerel yazılım masamıza destek verin.
                  </p>
                </div>
              )}
            </section>

            {/* SPONSORLUK ÇAĞRISI (CTA SECTION) */}
            <section
              className="card"
              style={{
                padding: 'clamp(2.5rem, 5vw, 3.5rem)',
                background: 'linear-gradient(145deg, rgba(227, 93, 20, 0.08) 0%, var(--bg-card) 100%)',
                border: '1px solid rgba(227, 93, 20, 0.3)',
                borderRadius: 'var(--radius-lg)',
                marginTop: '1.5rem',
              }}
            >
              <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(227, 93, 20, 0.12)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(227, 93, 20, 0.25)',
                    marginBottom: '1rem',
                  }}
                >
                  ORTAKLIK & DESTEK
                </span>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Uşak'ın Teknoloji Geleceğine Birlikte Yatırım Yapalım
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  Topluluğumuza sponsor olarak Uşak'taki yazılımcılara, mühendis adaylarına ve bağımsız üreticilere
                  destek olabilir; marka bilinirliğinizi yerel teknoloji ekosisteminde en üst düzeye taşıyabilirsiniz.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {links.whatsappGeneral && (
                    <button
                      type="button"
                      className="btn btn-whatsapp"
                      onClick={() => openWhatsAppWithRules(links.whatsappGeneral, 'Sponsorluk Talebi')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
                    >
                      <WhatsAppIcon size={18} />
                      <span>WhatsApp ile İletişime Geçin</span>
                    </button>
                  )}
                  <a
                    href="mailto:localhostusak@gmail.com?subject=Sponsorluk%20Hakk%C4%B1nda"
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Mail size={18} />
                    <span>E-Posta Gönderin</span>
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};
