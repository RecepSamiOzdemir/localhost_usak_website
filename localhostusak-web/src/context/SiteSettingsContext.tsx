import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettingsData,
  fetchSiteSettings,
  SiteStatItem,
  SitePersonaItem,
  SiteFlowStep,
  SiteValueItem,
  SiteCareerResource,
} from '../services/api';

const DEFAULT_STATS: SiteStatItem[] = [
  { target: 150, prefix: '', suffix: '+', label: 'Topluluk Üyesi' },
  { target: 3, prefix: '#', suffix: '', label: 'Başarılı Buluşma' },
  { target: 240, prefix: '', suffix: '+', label: 'İçilen Sıcak Kahve' },
  { target: 100, prefix: '%', suffix: '', label: 'Açık Kaynak & Bağımsız' },
];

const DEFAULT_VALUES: SiteValueItem[] = [
  {
    icon: '🧡',
    title: 'Resmiyetten Uzak, Samimi Bir Masa',
    description:
      'Buluşmalarımız kurumsal konferans formatında değil. Kimse kravat takmıyor, kimse unvan satmıyor. En tecrübeli yazılımcı da yeni başlayan öğrenci de aynı masada yan yana kahvesini yudumluyor.',
    tags: '#Samimiyet, #Eşitlik, #Yardımlaşma',
  },
  {
    icon: '🚀',
    title: 'Yerel Güç, Evrensel Vizyon',
    description:
      'Uşak\'ta üretip dünyaya açılmak mümkün. Şehirdeki yetenekleri birbirine bağlayarak ortak projeler ve startup tohumları atıyoruz.',
    tags: 'Local Roots, Global Wings',
  },
  {
    icon: '☕',
    title: 'Kahve Eşliğinde Coworking',
    description:
      'Uşak\'ın en keyifli kafelerinde toplanıp hem çalışıyor hem sosyalleşiyoruz. Odaklanma ve verimlilik masada artıyor.',
    tags: 'Coffee: ∞ | Bugs: 0',
  },
  {
    icon: '💡',
    title: 'Yalnız Gelebilir miyim? Kesinlikle Evet!',
    description:
      'Katılımcılarımızın çoğu ilk buluşmaya tek başına geldi. Masaya oturduğun andan itibaren topluluğun sıcaklığı seni kucaklar. Çekinmene hiç gerek yok!',
    tags: '#Topluluk',
  },
];

const DEFAULT_PERSONAS: SitePersonaItem[] = [
  {
    icon: '💡',
    title: 'Teknoloji Meraklıları',
    description:
      'Teknoloji dünyasındaki gelişmeleri, yapay zekayı ve dijital yenilikleri yakından takip edenler. Yeni fikirler keşfetmek, vizyonunu genişletmek ve ekosistemin nabzını tutmak için masada yerini al.',
    tags: 'Yapay Zeka, İnovasyon, Trendler, Vizyon',
  },
  {
    icon: '⚙️',
    title: 'Mühendis',
    description:
      'Bilgisayar, yazılım, endüstri, elektrik-elektronik ve tüm mühendislik disiplinlerinden profesyoneller. Sistem tasarımı, teknik mimariler ve analitik problem çözme yaklaşımlarını masada tartış.',
    tags: 'Sistem Tasarımı, Donanım, Otomasyon, Mimari',
  },
  {
    icon: '</>',
    title: 'Yazılım Geliştirici',
    description:
      'Frontend, Backend, Mobil, DevOps veya Veri alanlarında kod üretenler. Mimarileri konuş, takıldığın teknik problemleri masaya yatır ve yeni teknolojileri yan yana deneyimle.',
    tags: 'Frontend, Backend, DevOps, Mobile, Cloud',
  },
  {
    icon: '🌍',
    title: 'Remote and Freelance',
    description:
      'Uşak\'ta yaşayıp globale ya da farklı şehirlere uzaktan çalışanlar veya bağımsız projeler üretenler. Ev ortamının monotonluğundan çıkıp kahve eşliğinde üretken bir coworking atmosferi yakala.',
    tags: 'Coworking, Global, Freelance, Networking',
  },
];

const DEFAULT_FLOW_STEPS: SiteFlowStep[] = [
  {
    num: '01',
    title: 'Tanışma & Kahve',
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
    title: 'Muhabbet & Networking',
    desc: 'Topluluk projeleri, şehirdeki yeni girişimler ve gelecekteki buluşmalar üzerine konuşup yeni dostluklar kuruyoruz.',
  },
];

const DEFAULT_CAREER_RESOURCES: SiteCareerResource[] = [
  {
    icon: '📄',
    title: 'Modern CV & Portfolyo Şablonu',
    desc: 'ATS uyumlu, sade ve global standartlarda developer & designer özgeçmiş formatları.',
    tag: '#KariyerRehberi',
  },
  {
    icon: '🎯',
    title: 'Teknik Mülakat İpuçları',
    desc: 'Live coding mülakatlarında stres yönetimi, algoritma soruları ve sistem tasarımı yaklaşımı.',
    tag: '#Mülakat',
  },
  {
    icon: '🌐',
    title: 'Global Remote İş Arama',
    desc: 'Uşak\'tan döviz kazanarak dünyaya çalışma: platformlar, vergi/şirketleşme ve saat farkı yönetimi.',
    tag: '#RemoteWork',
  },
  {
    icon: '🤝',
    title: 'Birebir Mentorluk Eşleşmesi',
    desc: 'Kariyer başlangıcında takıldığın noktalarda topluluktaki kıdemli geliştiricilerden tavsiye al.',
    tag: '#Mentorluk',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  hero: {
    cityCoordinates: '38.6823° N, 29.4082° E',
    title: "Uşak'ın Teknoloji ve",
    titleHighlight: 'Tasarım Topluluğu',
    subtitle: 'connect • build • collaborate • grow',
    description:
      'Kahveni al, laptopunu getir, aramıza katıl. Deneyimli olmak şart değil; merakın ve öğrenme isteğin varsa masada sana da yer var.',
  },
  stats: DEFAULT_STATS,
  values: DEFAULT_VALUES,
  personas: DEFAULT_PERSONAS,
  flowSteps: DEFAULT_FLOW_STEPS,
  careerResources: DEFAULT_CAREER_RESOURCES,
};

interface SiteSettingsContextType {
  settings: SiteSettingsData;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  isLoading: false,
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    fetchSiteSettings()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setSettings({
            hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(data.hero || {}) },
            stats: data.stats && data.stats.length > 0 ? data.stats : DEFAULT_STATS,
            values: data.values && data.values.length > 0 ? data.values : DEFAULT_VALUES,
            personas: data.personas && data.personas.length > 0 ? data.personas : DEFAULT_PERSONAS,
            flowSteps: data.flowSteps && data.flowSteps.length > 0 ? data.flowSteps : DEFAULT_FLOW_STEPS,
            careerResources:
              data.careerResources && data.careerResources.length > 0
                ? data.careerResources
                : DEFAULT_CAREER_RESOURCES,
          });
        }
      })
      .catch(() => {
        // Fallback to defaults
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
