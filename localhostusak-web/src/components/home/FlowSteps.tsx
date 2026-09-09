import React from 'react';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Tanışma & Sıcak Kahve',
    desc: 'Mekana gelip masaya oturuyoruz. Kahvemizi sipariş edip kısaca kim neyle uğraşıyor tanışıyoruz. Sıkıcı sunumlar yok, tamamen samimi bir sohbet.',
  },
  {
    num: '02',
    title: 'Proje Paylaşımı & Geri Bildirim',
    desc: 'Üzerinde çalıştığın bir side-project\'i, yeni öğrendiğin bir kütüphaneyi masaya açıyorsun. Masadakilerden anında tarafsız ve yapıcı geri bildirim alıyorsun.',
  },
  {
    num: '03',
    title: 'Birlikte Çalışma & Problem Çözme',
    desc: 'Laptopları açıp çalışıyoruz. Takıldığın bir bug veya tasarım düğümü varsa masadaki herkes fikrini söylüyor, birlikte çözüyoruz.',
  },
  {
    num: '04',
    title: 'Serbest Muhabbet & Networking',
    desc: 'Topluluk projeleri, şehirdeki yeni girişimler ve gelecekteki buluşmalar üzerine konuşup yeni dostluklar kuruyoruz.',
  },
];

export const FlowSteps: React.FC = () => {
  return (
    <section className="section" id="flow">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// BULUŞMA FORMATI</span>
          <h2 className="section-title">Buluşmada Neler Olur?</h2>
          <p className="section-desc">
            İlk kez geleceksen endişelenme! 4 adımlı doğal ve rahat akışımız seni bekliyor.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {steps.map((s, index) => (
            <div key={index} className="flow-step">
              <div className="flow-number">{s.num}</div>
              <div className="flow-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
