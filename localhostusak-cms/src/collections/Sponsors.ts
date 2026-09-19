import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'sortOrder', 'isActive'],
  },
  access: {
    read: () => true, // Frontend can read sponsors publicly
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Sponsor / Destekçi adı',
      },
    },
    {
      name: 'tier',
      type: 'select',
      defaultValue: 'community',
      options: [
        { label: 'Altın Sponsor (Gold)', value: 'gold' },
        { label: 'Gümüş Sponsor (Silver)', value: 'silver' },
        { label: 'Bronz Sponsor (Bronze)', value: 'bronze' },
        { label: 'Topluluk Destekçisi (Community)', value: 'community' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Sponsor logo görseli',
      },
    },
    {
      name: 'logoUrl',
      type: 'text',
      admin: {
        description: 'Harici logo linki (Opsiyonel)',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Sponsor web sitesi bağlantısı',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sıralama önceliği (Küçük sayılar önce çıkar)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Sponsor yayında mı?',
      },
    },
  ],
}
