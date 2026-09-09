import React from 'react';

export const ValuesBento: React.FC = () => {
  return (
    <section className="section" id="values" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// DEĞERLERİMİZ</span>
          <h2 className="section-title">Neden Gelmelisin?</h2>
          <p className="section-desc">
            Uşak'ta teknolojiyle ilgilenen herkes için güvenli, üretken ve samimi bir liman.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1 (Span 8) */}
          <div className="card bento-card bento-span-8 circuit-border">
            <div>
              <div className="bento-icon" aria-hidden="true">
                🧡
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Resmiyetten Uzak, Samimi Bir Masa
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Buluşmalarımız kurumsal konferans formatında değil. Kimse kravat takmıyor, kimse unvan satmıyor. En tecrübeli yazılımcı da yeni başlayan öğrenci de aynı masada yan yana kahvesini yudumluyor.
              </p>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-orange">#Samimiyet</span>
              <span className="badge badge-blue">#Eşitlik</span>
              <span className="badge badge-orange">#Yardımlaşma</span>
            </div>
          </div>

          {/* Card 2 (Span 4) */}
          <div className="card bento-card bento-span-4">
            <div>
              <div className="bento-icon" aria-hidden="true">
                🚀
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Yerel Güç, Evrensel Vizyon
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Uşak'ta üretip dünyaya açılmak mümkün. Şehirdeki yetenekleri birbirine bağlayarak ortak projeler ve startup tohumları atıyoruz.
              </p>
            </div>
            <div
              style={{
                marginTop: '1.5rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-secondary)',
                fontSize: '0.85rem',
              }}
            >
              &gt;_ Local Roots, Global Wings
            </div>
          </div>

          {/* Card 3 (Span 4) */}
          <div className="card bento-card bento-span-4">
            <div>
              <div className="bento-icon" aria-hidden="true">
                ☕
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Kahve Eşliğinde Coworking
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Uşak'ın en keyifli kafelerinde toplanıp hem çalışıyor hem sosyalleşiyoruz. Odaklanma ve verimlilik masada artıyor.
              </p>
            </div>
            <div
              style={{
                marginTop: '1.5rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
              }}
            >
              &gt;_ Coffee: ∞ | Bugs: 0
            </div>
          </div>

          {/* Card 4 (Span 8) */}
          <div className="card bento-card bento-span-8 circuit-border">
            <div>
              <div className="bento-icon" aria-hidden="true">
                💡
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Yalnız Gelebilir miyim? Kesinlikle Evet!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Katılımcılarımızın çoğu ilk buluşmaya tek başına geldi. Masaya oturduğun andan itibaren topluluğun sıcaklığı seni kucaklar. Çekinmene hiç gerek yok!
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <span>İlk Adımı At: WhatsApp'a Katıl</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
