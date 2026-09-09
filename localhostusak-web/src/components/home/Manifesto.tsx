import React from 'react';

export const Manifesto: React.FC = () => {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center', gap: '3.5rem' }}>
          {/* Left Terminal Code Window */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot dot-red" />
                <span className="terminal-dot dot-yellow" />
                <span className="terminal-dot dot-green" />
              </div>
              <div className="terminal-title">localhostusak-manifesto.ts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UTF-8</div>
            </div>
            <div className="terminal-body">
              <p>
                <span className="terminal-comment">// Birlikte daha güçlüyüz, birlikte kodluyoruz.</span>
              </p>
              <p>
                <span className="terminal-prompt">&gt;</span>{' '}
                <span className="terminal-highlight">const</span> community = &#123;
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                name: <span style={{ color: '#A5D6FF' }}>"localhost[uşak]"</span>,
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                location: <span style={{ color: '#A5D6FF' }}>"Uşak, Türkiye"</span>,
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                purpose: <span style={{ color: '#A5D6FF' }}>"Yerel Güç, Evrensel Teknoloji"</span>,
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                entryFee: <span style={{ color: '#7EE787' }}>0</span>,{' '}
                <span className="terminal-comment">// Daima ücretsiz</span>
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                hierarchy: <span style={{ color: '#FF7B72' }}>false</span>,{' '}
                <span className="terminal-comment">// Eşit, hiyerarşisiz</span>
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                stack: [<span style={{ color: '#FFA133' }}>"Code"</span>,{' '}
                <span style={{ color: '#FFA133' }}>"Design"</span>,{' '}
                <span style={{ color: '#FFA133' }}>"Coffee"</span>,{' '}
                <span style={{ color: '#FFA133' }}>"AI"</span>],
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                motto: <span style={{ color: '#A5D6FF' }}>"Good Code, Better People"</span>
              </p>
              <p>&#125;;</p>
              <br />
              <p>
                <span className="terminal-prompt">&gt;</span>{' '}
                <span className="terminal-highlight">function</span> joinTable(developer) &#123;
              </p>
              <p style={{ paddingLeft: '1.5rem' }}>
                <span className="terminal-highlight">return</span> developer.bring(
                <span style={{ color: '#A5D6FF' }}>"laptop"</span>).add(
                <span style={{ color: '#A5D6FF' }}>"curiosity"</span>);
              </p>
              <p>&#125;</p>
              <br />
              <p>
                <span className="terminal-prompt">&gt;</span> joinTable(
                <span style={{ color: '#7EE787' }}>"SİZ"</span>);{' '}
                <span className="terminal-cursor" />
              </p>
            </div>
          </div>

          {/* Right Text & Vision */}
          <div>
            <span className="section-tag">// MİSYON & VİZYON</span>
            <h2 className="section-title">Şehirdeki Yalnız Çalışmayı Kırıyoruz</h2>
            <div className="pixel-bubble" style={{ display: 'none' }}>
              <strong>Kahveni al, masaya otur!</strong> Resmiyetten uzak, sıcak bir topluluk masası.
            </div>
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              Büyük şehirlerdeki teknoloji ekosistemi Uşak'ta neden olmasın?{' '}
              <strong>localhostusak</strong>, evden veya ofisten tek başına çalışan yazılımcıları,
              tasarımcıları ve genç yetenekleri fiziksel bir masada buluşturan bağımsız bir yerel
              topluluktur.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Burada sıkıcı seminerler, resmi unvanlar veya satış sunumları yok. Kahvemizi alıyoruz,
              laptoplarımızı açıyoruz; hem kendi projelerimizi kodluyor hem de birbirimize ilham
              veriyoruz.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="badge badge-orange">✓ Sıfır Hiyerarşi</div>
              <div className="badge badge-blue">✓ Tamamen Ücretsiz</div>
              <div className="badge badge-orange">✓ Açık Kaynak Ruhu</div>
              <div className="badge badge-blue">✓ Yerel Dayanışma</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
