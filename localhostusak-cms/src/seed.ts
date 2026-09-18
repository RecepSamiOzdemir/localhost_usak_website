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

  console.log('🎉 Tohumlama başarıyla tamamlandı! Tüm veriler PostgreSQL veritabanına işlendi.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Hata oluştu:', err)
  process.exit(1)
})
