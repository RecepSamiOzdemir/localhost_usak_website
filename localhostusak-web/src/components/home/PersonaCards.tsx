import React from 'react';

interface Persona {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const personas: Persona[] = [
  {
    icon: '</>',
    title: 'Yazılım Geliştiriciler',
    description:
      'Frontend, Backend, Mobil, DevOps veya AI mühendisleri. Kod yazarken takıldığın noktaları konuş, mimari tartış veya sadece yan yana kodla.',
    tags: ['React', 'Node.js', 'Python', 'Flutter', 'AI'],
  },
  {
    icon: '🎨',
    title: 'Tasarımcılar',
    description:
      'UI/UX tasarımcıları, grafik illüstratörler, 3D artistler ve ürün yöneticileri. Piksel mükemmelliğini ve kullanıcı deneyimini masada tartış.',
    tags: ['Figma', 'UI/UX', 'Design Systems', '3D'],
  },
  {
    icon: '🌍',
    title: 'Remote & Freelance',
    description:
      'Uşak\'ta yaşayıp globale ya da büyük şehirlere uzaktan çalışanlar. Evdeki dört duvar arasından çıkıp kahve kokulu bir coworking ortamı yakala.',
    tags: ['Coworking', 'Global', 'Freelance', 'Networking'],
  },
  {
    icon: '🎓',
    title: 'Öğrenci & Meraklılar',
    description:
      'Sektöre yeni girenler, üniversite öğrencileri ve kariyerini teknolojiye yönlendirmek isteyenler. Deneyimli kişilerden mentorluk al, staj veya proje arkadaşı bul.',
    tags: ['Öğrenme', 'Mentorluk', 'Kariyer', 'İlk Proje'],
  },
];

export const PersonaCards: React.FC = () => {
  return (
    <section className="section" id="personas" style={{ background: 'var(--bg-secondary)' }}>
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
