import React, { useState, useEffect } from 'react';
import { Users, Coffee, Sparkles, Globe, ArrowRight, Calendar, Code2, Briefcase, MapPin, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SiteVisionMessageItem } from '../../services/api';

const DEFAULT_VISION_MESSAGES: SiteVisionMessageItem[] = [
  {
    quote: "Uşak'ta sürdürülebilir, samimi ve profesyonel bir teknoloji ekosistemi oluşturmak.",
    tag: 'YOL HARİTAMIZ & VİZYONUMUZ',
    author: 'Localhost Uşak',
  },
  {
    quote: 'Kahveni al, masaya otur. Birlikte düşündüğümüzde ve ürettiğimizde çok daha güçlüyüz.',
    tag: 'GOOD CODE, BETTER PEOPLE',
    author: 'Açık Masa Felsefesi',
  },
  {
    quote: "Büyük şehirlerdeki teknoloji ve girişimcilik enerjisini Uşak'ın üretken yetenekleriyle buluşturuyoruz.",
    tag: 'YEREL DAYANIŞMA, KÜRESEL VİZYON',
    author: 'Ekosistem',
  },
  {
    quote: 'Unvanlar ve kurumsal hiyerarşiler kapıda kalır. Yeni başlayandan kıdemli mühendise herkes aynı masada eşittir.',
    tag: 'SIFIR HİYERARŞİ & EŞİT MASA',
    author: 'Temel İlke',
  },
];

export const Manifesto: React.FC = () => {
  const { settings } = useSiteSettings();
  const hero = settings.hero;

  const visionList =
    settings.visionMessages && settings.visionMessages.length > 0
      ? settings.visionMessages
      : DEFAULT_VISION_MESSAGES;

  const [activeVisionIdx, setActiveVisionIdx] = useState(0);
  const [isVisionHovered, setIsVisionHovered] = useState(false);

  useEffect(() => {
    if (isVisionHovered || visionList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveVisionIdx((prev) => (prev + 1) % visionList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isVisionHovered, visionList.length]);

  const activeVision = visionList[activeVisionIdx] || visionList[0];
  const pillars = [
    {
      icon: <Users size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Sıfır Hiyerarşi & Eşit Masa',
      desc: 'Unvanlar kapıda kalır. Tecrübe seviyesi fark etmeksizin herkes aynı masada eşit söz hakkına ve samimiyete sahiptir.',
    },
    {
      icon: <Coffee size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Daima & Tamamen Ücretsiz',
      desc: 'Coworking buluşmaları, etkinlikler ve bilgi paylaşımları herkes için her zaman ücretsizdir; ticari kaygı güdülmez.',
    },
    {
      icon: <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Açık Kaynak & Ortak Akıl',
      desc: 'Bilgi paylaştıkça çoğalır. Birlikte açık kaynak projeler kodluyor, deneyimlerimizi ve araçlarımızı paylaşıyoruz.',
    },
    {
      icon: <Globe size={22} style={{ color: 'var(--accent-primary)' }} />,
      title: 'Yerel Dayanışma, Küresel Vizyon',
      desc: "Uşak'ta yalnız çalışan teknoloji üreticilerini bir araya getiriyor, şehrimizden küresel çapta projelere kapı aralıyoruz.",
    },
  ];

  return (
    <section
      className="section manifesto-section"
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'calc(100vh - var(--navbar-total-height, 72px))',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(1.25rem, 2.5vh, 2.25rem) 0',
      }}
    >
      <div className="container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Editorial Manifesto Card */}
          <div
            className="card"
            style={{
              padding: 'clamp(1.4rem, 2.2vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--border-medium)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Top decorative badge */}
            <div>
              <div style={{ marginBottom: '0.85rem' }}>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(227, 93, 20, 0.1)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(227, 93, 20, 0.25)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.8rem',
                  }}
                >
                  ✦ BİZ KİMİZ & MANİFESTOMUZ
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.2vw, 1.95rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                  marginBottom: '0.85rem',
                  color: 'var(--text-primary)',
                }}
              >
                Uşak'ta Yazılım, Mühendislik ve Bilişim Ekosistemini Büyütüyoruz
              </h2>

              <p
                style={{
                  fontSize: '0.925rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: '0.65rem',
                }}
              >
                Büyük şehirlerdeki teknoloji enerjisi ve üretim ortamı Uşak'ta neden olmasın?{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Localhost Uşak</strong>; evden veya ofisten
                tek başına çalışan yazılımcıları, tasarımcıları, mühendisleri ve teknoloji meraklılarını
                fiziksel bir masada buluşturan bağımsız bir yerel topluluktur.
              </p>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '0.85rem',
                }}
              >
                Burada resmi unvanlar, sıkıcı seminerler veya ticari satış sunumları yok. Kahvemizi alıyoruz,
                laptoplarımızı açıyoruz; hem kendi projelerimizi üretiyor hem de birbirimize destek olarak
                şehrimizin dijital potansiyelini açığa çıkarıyoruz.
              </p>

              {/* Topluluk Masamızda Neler Var? (SEO & Dahili Bağlantılar) */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Topluluk Masamızda Neler Var?
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  <Link
                    to="/etkinlikler"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Calendar size={12} style={{ color: 'var(--accent-primary)' }} />
                    <span>Coworking & Buluşmalar</span>
                  </Link>

                  <Link
                    to="/projeler"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Code2 size={12} style={{ color: 'var(--accent-primary)' }} />
                    <span>Açık Kaynak Projeler</span>
                  </Link>

                  <Link
                    to="/kariyer"
                    className="badge"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Briefcase size={12} style={{ color: 'var(--accent-primary)' }} />
                    <span>Kariyer & İlanlar</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dynamic Rotating Vision Card (Zero Layout Shift) */}
            <div
              className="manifesto-vision-card"
              onMouseEnter={() => setIsVisionHovered(true)}
              onMouseLeave={() => setIsVisionHovered(false)}
            >
              <div className="manifesto-vision-header">
                <span className="manifesto-vision-tag">
                  <Quote size={12} style={{ transform: 'rotate(180deg)' }} />
                  <span>{activeVision.tag || 'TOPLULUK VİZYONU'}</span>
                </span>

                {/* Dot Pagination Controls */}
                <div className="manifesto-vision-dots">
                  {visionList.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveVisionIdx(dotIdx)}
                      aria-label={`Vizyon mesajı ${dotIdx + 1}`}
                      style={{
                        width: dotIdx === activeVisionIdx ? '16px' : '5px',
                        height: '5px',
                        borderRadius: 'var(--radius-full)',
                        background: dotIdx === activeVisionIdx ? 'var(--accent-primary)' : 'var(--border-medium)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="manifesto-vision-quote-wrap">
                <div key={activeVisionIdx} className="manifesto-vision-quote">
                  "{activeVision.quote}"
                </div>
              </div>

              <div className="manifesto-vision-author">
                {activeVision.author ? `— ${activeVision.author}` : ''}
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Value Cards + CTA Banner */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  flex: 1,
                  minHeight: 0,
                  padding: '0.65rem 1.15rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform var(--transition-normal), border-color var(--transition-normal)',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(227, 93, 20, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(227, 93, 20, 0.2)',
                  }}
                >
                  {pillar.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.15rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Banner to Next Event / Community */}
            <div
              className="card"
              style={{
                padding: '0.65rem 1.15rem',
                background: 'linear-gradient(135deg, rgba(227, 93, 20, 0.1) 0%, var(--bg-card) 100%)',
                border: '1px solid rgba(227, 93, 20, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.65rem',
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Masada Sana da Yer Var
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Uşak'taki bir sonraki fiziksel buluşmayı incele.
                </div>
              </div>
              <Link
                to="/etkinlikler"
                className="btn btn-sm btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                }}
              >
                <span>Buluşmaları Gör</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
