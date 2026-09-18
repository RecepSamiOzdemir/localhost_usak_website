import type { CollectionConfig } from 'payload'

export const CommunityLinks: CollectionConfig = {
  slug: 'community-links',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'key', 'url', 'isActive'],
  },
  access: {
    read: () => true, // Frontend can read links publicly
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Benzersiz anahtar (Örn: whatsapp_coworking, whatsapp_projects, whatsapp_careers)',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Görünen etiket (Örn: WhatsApp Coworking Grubu)',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Bağlantı adresi (URL)',
      },
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Kısa açıklama',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
