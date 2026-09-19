import type { CollectionConfig } from 'payload'

export const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'type', 'workMode', 'isActive'],
  },
  access: {
    read: () => true, // Frontend can read careers publicly
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'İlan başlığı (Örn: Junior Frontend Developer)',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Şirket veya topluluk adı',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'job',
      options: [
        { label: 'İş İlanı (Job)', value: 'job' },
        { label: 'Staj (Internship)', value: 'internship' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Mentörlük (Mentorship)', value: 'mentorship' },
      ],
    },
    {
      name: 'workMode',
      type: 'select',
      defaultValue: 'remote',
      options: [
        { label: 'Uzaktan (Remote)', value: 'remote' },
        { label: 'Hibrit (Hybrid)', value: 'hybrid' },
        { label: 'Yerinde (Onsite)', value: 'onsite' },
      ],
    },
    {
      name: 'schedule',
      type: 'select',
      defaultValue: 'fulltime',
      options: [
        { label: 'Tam Zamanlı (Full-Time)', value: 'fulltime' },
        { label: 'Yarı Zamanlı (Part-Time)', value: 'parttime' },
        { label: 'Proje Bazlı (Project)', value: 'project' },
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
        description: 'Kullanılan teknolojiler (Örn: React, Node.js, TypeScript)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'İlan detayları ve aranan nitelikler',
      },
    },
    {
      name: 'applyUrl',
      type: 'text',
      admin: {
        description: 'Başvuru linki veya e-posta',
      },
    },
    {
      name: 'contact',
      type: 'text',
      admin: {
        description: 'İletişim kişisi veya platformu',
      },
    },
    {
      name: 'postedBy',
      type: 'text',
      admin: {
        description: 'İlanı paylaşan kişi / kurum',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'İlan yayında mı?',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'İlan bitiş tarihi',
      },
    },
  ],
}
