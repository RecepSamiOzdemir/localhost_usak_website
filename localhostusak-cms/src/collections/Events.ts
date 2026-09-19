import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'dateStart', 'location'],
  },
  access: {
    read: () => true, // Frontend can read events publicly
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'event-types',
      required: true,
      admin: {
        description: 'Etkinlik türü seçin',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'upcoming',
      options: [
        { label: 'Yaklaşan (Upcoming)', value: 'upcoming' },
        { label: 'Tamamlandı (Completed)', value: 'completed' },
        { label: 'İptal Edildi (Cancelled)', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'dateStart',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dateEnd',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Mekan adı (Örn: Coff The Story / Treehouse Cafe)',
      },
    },
    {
      name: 'mapUrl',
      type: 'text',
      admin: {
        description: 'Google Maps bağlantısı',
      },
    },
    {
      name: 'capacity',
      type: 'number',
    },
    {
      name: 'attendees',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Etkinlik kapak görseli (Sürükle-bırak)',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Harici görsel linki (Opsiyonel alternatif)',
      },
    },
    {
      name: 'whatsappLink',
      type: 'text',
      admin: {
        description: 'Etkinlik / Topluluk WhatsApp grup linki',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Etiketler (Örn: #WebDev, #AIAgents)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Etkinlik detayları ve açıklaması',
      },
    },
  ],
}
