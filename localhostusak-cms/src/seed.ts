import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function seed() {
  console.log('🌱 Payload CMS veritabanı tohumlama (seed) başlatılıyor...')
  const payload = await getPayload({ config })

  // 1. Event Types
  const typesDataPath = path.resolve(dirname, '../../localhostusak-web/src/data/eventTypes.json')
  const typesData = JSON.parse(fs.readFileSync(typesDataPath, 'utf-8'))
  const typeMap: Record<string, string | number> = {}

  for (const t of typesData) {
    const existing = await payload.find({
      collection: 'event-types',
      where: {
        slug: {
          equals: t.id,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'event-types',
        data: {
          slug: t.id,
          label: t.label,
          icon: t.icon,
          colorModern: t.colorModern,
          colorPixel: t.colorPixel,
          isDefault: t.isDefault ?? true,
          sortOrder: t.sortOrder ?? 0,
        },
      })
      typeMap[t.id] = created.id
      console.log(`  ✓ Etkinlik Türü eklendi: ${t.label}`)
    } else {
      typeMap[t.id] = existing.docs[0].id
      console.log(`  - Etkinlik Türü zaten mevcut: ${t.label}`)
    }
  }

  // 2. Events
  const eventsDataPath = path.resolve(dirname, '../../localhostusak-web/src/data/events.json')
  const eventsData = JSON.parse(fs.readFileSync(eventsDataPath, 'utf-8'))

  for (const ev of eventsData) {
    const existing = await payload.find({
      collection: 'events',
      where: {
        title: {
          equals: ev.title,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      const typeId = typeMap[ev.typeId] || Object.values(typeMap)[0]
      await payload.create({
        collection: 'events',
        data: {
          title: ev.title,
          description: ev.description,
          type: typeId as any,
          status: ev.status || 'upcoming',
          dateStart: ev.dateStart,
          dateEnd: ev.dateEnd || undefined,
          location: ev.location,
          mapUrl: ev.mapUrl,
          capacity: ev.capacity,
          attendees: ev.attendees || 0,
          imageUrl: ev.imageUrl,
          whatsappLink: ev.whatsappLink,
          tags: ev.tags ? ev.tags.map((tag: string) => ({ tag })) : [],
        },
      })
      console.log(`  ✓ Etkinlik eklendi: ${ev.title}`)
    } else {
      console.log(`  - Etkinlik zaten mevcut: ${ev.title}`)
    }
  }

  // 3. Careers
  const careersDataPath = path.resolve(dirname, '../../localhostusak-web/src/data/careers.json')
  const careersData = JSON.parse(fs.readFileSync(careersDataPath, 'utf-8'))

  for (const c of careersData) {
    const existing = await payload.find({
      collection: 'careers',
      where: {
        title: {
          equals: c.title,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'careers',
        data: {
          title: c.title,
          company: c.company,
          type: c.type || 'job',
          workMode: c.workMode || 'remote',
          schedule: c.schedule || 'fulltime',
          description: c.description,
          technologies: c.technologies ? c.technologies.map((name: string) => ({ name })) : [],
          applyUrl: c.applyUrl,
          contact: c.contact,
          postedBy: c.postedBy,
          isActive: c.isActive !== false,
        },
      })
      console.log(`  ✓ İlan eklendi: ${c.title}`)
    } else {
      console.log(`  - İlan zaten mevcut: ${c.title}`)
    }
  }

  // 4. Projects
  const projectsDataPath = path.resolve(dirname, '../../localhostusak-web/src/data/projects.json')
  const projectsData = JSON.parse(fs.readFileSync(projectsDataPath, 'utf-8'))

  for (const p of projectsData) {
    const existing = await payload.find({
      collection: 'projects',
      where: {
        name: {
          equals: p.name,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'projects',
        data: {
          name: p.name,
          description: p.description,
          type: p.type || 'showcase',
          technologies: p.technologies ? p.technologies.map((name: string) => ({ name })) : [],
          owner: p.owner,
          teamSize: p.teamSize || 1,
          teamMax: p.teamMax,
          rolesNeeded: p.rolesNeeded ? p.rolesNeeded.map((role: string) => ({ role })) : [],
          githubUrl: p.githubUrl,
          demoUrl: p.demoUrl,
          imageUrl: p.imageUrl,
          likes: p.likes || 0,
          isActive: p.isActive !== false,
        },
      })
      console.log(`  ✓ Proje eklendi: ${p.name}`)
    } else {
      console.log(`  - Proje zaten mevcut: ${p.name}`)
    }
  }

  // 5. Community Links
  const links = [
    { key: 'whatsappGeneral', label: 'Genel WhatsApp Topluluğu', url: 'https://chat.whatsapp.com/', description: 'Ana topluluk grubu' },
    { key: 'whatsappProjects', label: 'Projeler WhatsApp Grubu', url: 'https://chat.whatsapp.com/', description: 'Açık kaynak ve üretim grubu' },
    { key: 'whatsappCareers', label: 'Kariyer & İlanlar WhatsApp Grubu', url: 'https://chat.whatsapp.com/', description: 'İş ve staj kanalı' },
    { key: 'whatsappCoworking', label: 'Coworking & Etkinlikler Grubu', url: 'https://chat.whatsapp.com/', description: 'Fiziksel kafe buluşmaları' },
    { key: 'instagram', label: 'Instagram', url: 'https://instagram.com/localhostusak', description: 'Fotoğraf ve reels' },
    { key: 'github', label: 'GitHub', url: 'https://github.com/localhostusak', description: 'Açık kaynak repolar' },
    { key: 'x', label: 'X (Twitter)', url: 'https://x.com/localhostusak', description: 'Haber ve duyurular' },
  ]

  for (const l of links) {
    const existing = await payload.find({
      collection: 'community-links',
      where: {
        key: {
          equals: l.key,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'community-links',
        data: {
          key: l.key,
          label: l.label,
          url: l.url,
          description: l.description,
          isActive: true,
        },
      })
      console.log(`  ✓ Bağlantı eklendi: ${l.label}`)
    } else {
      console.log(`  - Bağlantı zaten mevcut: ${l.label}`)
    }
  }

  // 6. Site Settings (Global)
  console.log('  -> Site Ayarları (Global) kontrol ediliyor...')
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        hero: {
          cityCoordinates: '38.6823° N, 29.4082° E',
          title: "Uşak'ın Teknoloji ve",
          titleHighlight: 'Tasarım Topluluğu',
          subtitle: 'connect • build • collaborate • grow',
          description:
            'Kahveni al, laptopunu getir, aramıza katıl. Deneyimli olmak şart değil; merakın ve öğrenme isteğin varsa masada sana da yer var.',
        },
        stats: [
          { target: 150, prefix: '', suffix: '+', label: 'Topluluk Üyesi' },
          { target: 3, prefix: '#', suffix: '', label: 'Başarılı Buluşma' },
          { target: 240, prefix: '', suffix: '+', label: 'İçilen Sıcak Kahve' },
          { target: 100, prefix: '%', suffix: '', label: 'Açık Kaynak & Bağımsız' },
        ],
        values: [
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
              "Uşak'ta üretip dünyaya açılmak mümkün. Şehirdeki yetenekleri birbirine bağlayarak ortak projeler ve startup tohumları atıyoruz.",
            tags: 'Local Roots, Global Wings',
          },
          {
            icon: '☕',
            title: 'Kahve Eşliğinde Coworking',
            description:
              "Uşak'ın en keyifli kafelerinde toplanıp hem çalışıyor hem sosyalleşiyoruz. Odaklanma ve verimlilik masada artıyor.",
            tags: 'Coffee: ∞ | Bugs: 0',
          },
          {
            icon: '💡',
            title: 'Yalnız Gelebilir miyim? Kesinlikle Evet!',
            description:
              'Katılımcılarımızın çoğu ilk buluşmaya tek başına geldi. Masaya oturduğun andan itibaren topluluğun sıcaklığı seni kucaklar. Çekinmene hiç gerek yok!',
            tags: '#Topluluk',
          },
        ],
        personas: [
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
              "Uşak'ta yaşayıp globale ya da farklı şehirlere uzaktan çalışanlar veya bağımsız projeler üretenler. Ev ortamının monotonluğundan çıkıp kahve eşliğinde üretken bir coworking atmosferi yakala.",
            tags: 'Coworking, Global, Freelance, Networking',
          },
        ],
        flowSteps: [
          {
            num: '01',
            title: 'Tanışma & Kahve',
            desc: 'Mekana gelip masaya oturuyoruz. Kahvemizi sipariş edip kısaca kim neyle uğraşıyor tanışıyoruz. Sıkıcı sunumlar yok, tamamen samimi bir sohbet.',
          },
          {
            num: '02',
            title: 'Proje Paylaşımı & Geri Bildirim',
            desc: "Üzerinde çalıştığın bir side-project'i, yeni öğrendiğin bir kütüphaneyi masaya açıyorsun. Masadakilerden anında tarafsız ve yapıcı geri bildirim alıyorsun.",
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
        ],
        careerResources: [
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
            desc: "Uşak'tan döviz kazanarak dünyaya çalışma: platformlar, vergi/şirketleşme ve saat farkı yönetimi.",
            tag: '#RemoteWork',
          },
          {
            icon: '🤝',
            title: 'Birebir Mentorluk Eşleşmesi',
            desc: 'Kariyer başlangıcında takıldığın noktalarda topluluktaki kıdemli geliştiricilerden tavsiye al.',
            tag: '#Mentorluk',
          },
        ],
      },
    })
    console.log('  ✓ Ana Sayfa Ayarları (Global) başarıyla tohumlandı.')
  } catch (err: any) {
    console.error('  ⚠️ Ana Sayfa Ayarları tohumlanırken hata (atlanıyor):', err?.message || err)
  }

  // 8. General Settings (Global)
  try {
    await payload.updateGlobal({
      slug: 'general-settings',
      data: {
        meta: {
          siteTitle: "localhostusak — Uşak'ın Teknoloji ve Tasarım Topluluğu",
          defaultDescription:
            "Uşak'taki yazılımcılar, tasarımcılar, remote çalışanlar ve öğrenciler için açık, samimi ve üretken teknoloji topluluğu. Kahveni al, laptopunu getir!",
          keywords:
            'Uşak yazılım, Uşak teknoloji, localhostusak, developer community, UI UX Uşak, Uşak meetup, remote çalışma, coworking',
        },
        header: {
          announcementActive: false,
          announcementText: '🎉 Yeni buluşma takvimimiz açıklandı! Detaylar etkinlikler sayfasında.',
          announcementUrl: '/etkinlikler',
        },
        footer: {
          tagline:
            "Uşak'ın yerel teknoloji, yazılım ve tasarım ekosistemini büyüten açık ve bağımsız topluluk.",
          locationCoordinates: '38.6823° N, 29.4082° E',
          copyrightText: "© 2026 localhostusak • Uşak'ta sevgiyle kodlandı 🧡",
        },
      },
    })
    console.log('  ✓ Genel Site & SEO Ayarları (Global) başarıyla tohumlandı.')
  } catch (err: any) {
    console.error('  ⚠️ Genel Ayarlar tohumlanırken hata (atlanıyor):', err?.message || err)
  }

  // 9. Events Page Settings (Global)
  try {
    await payload.updateGlobal({
      slug: 'events-page-settings',
      data: {
        hero: {
          tag: '// ETKİNLİK TAKVİMİ & COWORKING',
          title: "Cowork'ten Workshop'a,",
          highlightText: 'Tüm Buluşmalar',
          description:
            "Kahveni al, etkinliğini seç, masada yerini al. Yazılım, tasarım, yapay zeka ve serbest çalışma Uşak'ta aynı masada.",
        },
        whatsappCta: {
          buttonText: 'WhatsApp Coworking Grubuna Katıl',
        },
        meta: {
          title: 'Etkinlikler & Coworking — localhostusak',
          description:
            "Uşak'taki yazılım, tasarım ve yapay zeka buluşmaları, coworking günleri ve workshop takvimi.",
        },
      },
    })
    console.log('  ✓ Etkinlikler Sayfası Ayarları (Global) başarıyla tohumlandı.')
  } catch (err: any) {
    console.error('  ⚠️ Etkinlikler Ayarları tohumlanırken hata (atlanıyor):', err?.message || err)
  }

  // 10. Careers Page Settings (Global)
  try {
    await payload.updateGlobal({
      slug: 'careers-page-settings',
      data: {
        hero: {
          tag: '// KARİYER & FIRSAT PANOSU',
          title: "Uşak'tan Globale,",
          highlightText: 'Doğru Fırsatı Yakala',
          description:
            'Topluluk üyelerinin paylaştığı iş ilanları, staj fırsatları, freelance projeler ve ücretsiz mentorluk eşleşmeleri.',
        },
        whatsappCta: {
          buttonText: 'WhatsApp Kariyer Grubuna Katıl',
        },
        careerResources: [
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
            desc: "Uşak'tan döviz kazanarak dünyaya çalışma: platformlar, vergi/şirketleşme ve saat farkı yönetimi.",
            tag: '#RemoteWork',
          },
          {
            icon: '🤝',
            title: 'Birebir Mentorluk Eşleşmesi',
            desc: 'Kariyer başlangıcında takıldığın noktalarda topluluktaki kıdemli geliştiricilerden tavsiye al.',
            tag: '#Mentorluk',
          },
        ],
        meta: {
          title: 'Kariyer & İlanlar — localhostusak',
          description:
            "Uşak ve uzaktan çalışma olanakları; teknoloji, yazılım, staj ve freelance kariyer fırsatları panosu.",
        },
      },
    })
    console.log('  ✓ Kariyer Sayfası Ayarları (Global) başarıyla tohumlandı.')
  } catch (err: any) {
    console.error('  ⚠️ Kariyer Ayarları tohumlanırken hata (atlanıyor):', err?.message || err)
  }

  // 11. Projects Page Settings (Global)
  try {
    await payload.updateGlobal({
      slug: 'projects-page-settings',
      data: {
        hero: {
          tag: '// PROJE VİTRİNİ & AÇIK KAYNAK',
          title: "Uşak'ta Üretiliyor,",
          highlightText: 'Dünyaya Açılıyor',
          description:
            'Topluluk üyelerimizin geliştirdiği açık kaynak projeler, erken aşama girişimler ve birlikte üretmek için ekip arkadaşı arayanlar.',
        },
        whatsappCta: {
          buttonText: 'WhatsApp Projeler Grubuna Katıl',
        },
        meta: {
          title: 'Projeler & Vitrin — localhostusak',
          description:
            "Uşak teknoloji topluluğu üyelerinin geliştirdiği projeler, açık kaynak depoları ve ekip arkadaşı arayan girişimler.",
        },
      },
    })
    console.log('  ✓ Projeler Sayfası Ayarları (Global) başarıyla tohumlandı.')
  } catch (err: any) {
    console.error('  ⚠️ Projeler Ayarları tohumlanırken hata (atlanıyor):', err?.message || err)
  }

  console.log('🎉 Tohumlama başarıyla tamamlandı! Tüm veriler PostgreSQL veritabanına işlendi.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Hata oluştu:', err)
  process.exit(1)
})
