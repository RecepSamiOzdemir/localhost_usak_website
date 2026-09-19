import type { CollectionConfig } from 'payload'

export const EventTypes: CollectionConfig = {
  slug: 'event-types',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'icon', 'sortOrder'],
  },
  access: {
    read: () => true, // Publicly readable by frontend
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Örn: cowork, workshop, talk, hackathon',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Görünen isim (Örn: Cowork & Sohbet)',
      },
    },
    {
      name: 'icon',
      type: 'text',
      required: true,
      defaultValue: '☕',
      admin: {
        description: 'Emoji veya simge (Örn: ☕, 🛠️, 🎤)',
      },
    },
    {
      name: 'colorModern',
      type: 'text',
      required: true,
      defaultValue: '#FF6600',
      admin: {
        description: 'Modern HUD tema rengi (HEX)',
      },
    },
    {
      name: 'colorPixel',
      type: 'text',
      required: true,
      defaultValue: '#EE6C19',
      admin: {
        description: 'Pixel Retro tema rengi (HEX)',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
