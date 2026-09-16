import { useLinks } from '../../context/LinksContext';
import { useWhatsAppModal } from '../../context/WhatsAppModalContext';

export const BigCTA: React.FC = () => {
  const { links } = useLinks();
  const { openWhatsAppWithRules } = useWhatsAppModal();
  return (
    <section className="section" id="cta" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          className="card circuit-border"
          style={{
            padding: '4.5rem 3rem',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <span className="section-tag" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            // HEMEN ARAMIZA KATIL
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              marginBottom: '1.25rem',
            }}
          >
            Bir Sonraki Kahveyi <br />
            <span className="gradient-text-orange">Birlikte İçelim</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.15rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            Buluşma duyurularını kaçırmamak, masada yerini ayırtmak ve Uşak'taki diğer teknoloji
            tutkunlarıyla anında iletişim kurmak için WhatsApp grubumuza katıl.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
            <a
              href={links.whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
              id="cta-btn-whatsapp"
              onClick={(e) => {
                e.preventDefault();
                openWhatsAppWithRules(links.whatsappGeneral, 'Genel Topluluk Grubu');
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.938l-1.564 5.719 5.873-1.541c1.707.95 3.666 1.484 5.727 1.484 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp Topluluğuna Katıl</span>
            </a>

            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-secondary"
              id="cta-btn-instagram"
            >
              <span>📷 Instagram'da Takip Et</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
