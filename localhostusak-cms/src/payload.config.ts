import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { EventTypes } from './collections/EventTypes'
import { Events } from './collections/Events'
import { Careers } from './collections/Careers'
import { Projects } from './collections/Projects'
import { Sponsors } from './collections/Sponsors'
import { CommunityLinks } from './collections/CommunityLinks'
import { SiteSettings } from './globals/SiteSettings'
import { GeneralSettings } from './globals/GeneralSettings'
import { EventsPageSettings } from './globals/EventsPageSettings'
import { CareersPageSettings } from './globals/CareersPageSettings'
import { ProjectsPageSettings } from './globals/ProjectsPageSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    EventTypes,
    Events,
    Careers,
    Projects,
    Sponsors,
    CommunityLinks,
  ],
  globals: [
    GeneralSettings,
    SiteSettings,
    EventsPageSettings,
    CareersPageSettings,
    ProjectsPageSettings,
  ],
  cors: [
    'https://localhostusak.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  csrf: [
    'https://localhostusak.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev_secret_localhostusak_payload_2026_x89a',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
