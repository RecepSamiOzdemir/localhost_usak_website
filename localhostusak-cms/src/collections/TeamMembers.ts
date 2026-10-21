import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'sortOrder', 'isActive'],
  },
  access: {
    read: () => true, // Frontend ekip üyelerini herkese açık olarak okuyabilir
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ad Soyad',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'contributor',
      label: 'Kategori',
      options: [
        { label: 'Kurucu', value: 'founder' },
        { label: 'Çekirdek Ekip (Yönetim)', value: 'core' },
        { label: 'Gönüllü / Katkı Sağlayan', value: 'contributor' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Unvan / Rol',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profil Fotoğrafı',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Kısa Tanıtım',
    },
    {
      name: 'github',
      type: 'text',
      label: 'GitHub',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn',
    },
    {
      name: 'x',
      type: 'text',
      label: 'X (Twitter)',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Sıralama',
      admin: {
        description: 'Sıralama önceliği (Küçük sayılar önce çıkar)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      label: 'Yayında mı?',
      admin: {
        description: 'Kişinin yayın izni alındıktan sonra işaretleyin.',
      },
    },
  ],
}
