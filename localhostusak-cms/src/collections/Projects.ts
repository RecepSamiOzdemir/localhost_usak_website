import type { CollectionConfig } from 'payload'

// In-memory rate limiting for project likes (IP + Project ID cooldown)
const likeRateLimits = new Map<string, number>()
const LIKE_COOLDOWN_MS = 60 * 1000 // 1 minute per project per IP

function isRateLimited(ip: string, projectId: string): boolean {
  const key = `${ip}:${projectId}`
  const now = Date.now()
  const lastLike = likeRateLimits.get(key)

  if (likeRateLimits.size > 5000) {
    for (const [k, timestamp] of likeRateLimits.entries()) {
      if (now - timestamp > LIKE_COOLDOWN_MS * 5) {
        likeRateLimits.delete(k)
      }
    }
  }

  if (lastLike && now - lastLike < LIKE_COOLDOWN_MS) {
    return true
  }

  likeRateLimits.set(key, now)
  return false
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'owner', 'type', 'likes', 'isActive'],
  },
  access: {
    read: () => true, // Frontend can read projects publicly
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  endpoints: [
    {
      path: '/:id/like',
      method: 'patch',
      handler: async (req) => {
        try {
          const id = req.routeParams?.id as string
          if (!id) {
            return Response.json({ error: 'ID gereklidir' }, { status: 400 })
          }

          // Rate limit check
          const getHeader = (name: string): string | null => {
            if (!req.headers) return null
            if (typeof (req.headers as any).get === 'function') {
              return (req.headers as Headers).get(name)
            }
            return (req.headers as any)[name] || (req.headers as any)[name.toLowerCase()] || null
          }

          const clientIp =
            getHeader('x-forwarded-for')?.split(',')[0]?.trim() ||
            getHeader('x-real-ip') ||
            'unknown'

          if (isRateLimited(clientIp, id)) {
            return Response.json(
              { error: 'Çok fazla beğeni gönderdiniz. Lütfen 1 dakika sonra tekrar deneyin.' },
              { status: 429 }
            )
          }

          const project = await req.payload.findByID({
            collection: 'projects',
            id,
          })

          if (!project) {
            return Response.json({ error: 'Proje bulunamadı' }, { status: 404 })
          }

          const updated = await req.payload.update({
            collection: 'projects',
            id,
            data: {
              likes: ((project.likes as number) || 0) + 1,
            },
          })

          return Response.json({ success: true, likes: updated.likes })
        } catch (error: any) {
          return Response.json({ error: error.message || 'Hata oluştu' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Proje adı',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Proje açıklaması ve vizyonu',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'showcase',
      options: [
        { label: 'Vitrin / Tamamlanmış (Showcase)', value: 'showcase' },
        { label: 'Ekip Arkadaşı Arıyor (Seeking Team)', value: 'seeking_team' },
        { label: 'Açık Kaynak (Open Source)', value: 'opensource' },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      admin: {
        description: 'Projede kullanılan teknolojiler',
      },
    },
    {
      name: 'owner',
      type: 'text',
      admin: {
        description: 'Proje sahibi / Takım lideri',
      },
    },
    {
      name: 'teamSize',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'teamMax',
      type: 'number',
    },
    {
      name: 'rolesNeeded',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'text',
        },
      ],
      admin: {
        description: 'Aranan roller (Örn: UI Tasarımcı, Frontend Dev)',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        description: 'GitHub repo bağlantısı',
      },
    },
    {
      name: 'demoUrl',
      type: 'text',
      admin: {
        description: 'Canlı demo bağlantısı',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Proje kapak görseli',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Harici görsel linki (Opsiyonel)',
      },
    },
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Topluluk beğeni sayısı',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Proje yayında mı?',
      },
    },
  ],
}
