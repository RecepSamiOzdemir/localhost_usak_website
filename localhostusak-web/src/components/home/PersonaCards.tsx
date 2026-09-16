import React from 'react';

interface Persona {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const personas: Persona[] = [
  {
    icon: '💡',
    title: 'Teknoloji Meraklıları',
    description:
      'Teknoloji dünyasındaki gelişmeleri, yapay zekayı ve dijital yenilikleri yakından takip edenler. Yeni fikirler keşfetmek, vizyonunu genişletmek ve ekosistemin nabzını tutmak için masada yerini al.',
    tags: ['Yapay Zeka', 'İnovasyon', 'Trendler', 'Vizyon'],
  },
  {
    icon: '⚙️',
    title: 'Mühendis',
    description:
      'Bilgisayar, yazılım, endüstri, elektrik-elektronik ve tüm mühendislik disiplinlerinden profesyoneller. Sistem tasarımı, teknik mimariler ve analitik problem çözme yaklaşımlarını masada tartış.',
    tags: ['Sistem Tasarımı', 'Donanım', 'Otomasyon', 'Mimari'],
  },
  {
    icon: '</>',
    title: 'Yazılım Geliştirici',
    description:
      'Frontend, Backend, Mobil, DevOps veya Veri alanlarında kod üretenler. Mimarileri konuş, takıldığın teknik problemleri masaya yatır ve yeni teknolojileri yan yana deneyimle.',
    tags: ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Cloud'],
  },
  {
    icon: '🌍',
    title: 'Remote and Freelance',
    description:
      "Uşak'ta yaşayıp globale ya da farklı şehirlere uzaktan çalışanlar veya bağımsız projeler üretenler. Ev ortamının monotonluğundan çıkıp kahve eşliğinde üretken bir coworking atmosferi yakala.",
    tags: ['Coworking', 'Global', 'Freelance', 'Networking'],
  },
];

export const PersonaCards: React.FC = () => {
  return (
    <section className="section" id="personas">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// MASADA KİMLER VAR?</span>
          <h2 className="section-title">Kimler Katılabilir?</h2>
          <p className="section-desc">
            Teknolojiye merakı olan herkese kapımız açık. Masadaki yerini seç!
          </p>
        </div>

        <div className="grid-4">
          {personas.map((persona, index) => (
            <article key={index} className="card card-interactive persona-card">
              <div className="persona-icon-box" aria-hidden="true">
                {persona.icon}
              </div>
              <h3 className="persona-title">{persona.title}</h3>
              <p className="persona-desc">{persona.description}</p>
              <div className="persona-tags">
                {persona.tags.map((t, idx) => (
                  <span key={idx} className="persona-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
