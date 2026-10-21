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
import { TeamMembers } from './collections/TeamMembers'
import { CommunityLinks } from './collections/CommunityLinks'
import { JobApplications } from './collections/JobApplications'
import { SiteSettings } from './globals/SiteSettings'
import { GeneralSettings } from './globals/GeneralSettings'
import { EventsPageSettings } from './globals/EventsPageSettings'
import { CareersPageSettings } from './globals/CareersPageSettings'
import { ProjectsPageSettings } from './globals/ProjectsPageSettings'
import { KvkkSettings } from './globals/KvkkSettings'
import { migrations } from './migrations'

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
    TeamMembers,
    CommunityLinks,
    JobApplications,
  ],
  globals: [
    GeneralSettings,
    SiteSettings,
    EventsPageSettings,
    CareersPageSettings,
    ProjectsPageSettings,
    KvkkSettings,
  ],
  cors: [
    'https://localhostusak.com',
    'https://www.localhostusak.com',
    'https://localhostusak.tech',
    'https://www.localhostusak.tech',
    'http://rwqqhpeag4mw5peahi5ru5s6.31.77.112.167.sslip.io',
    'http://cet3r7uoxel41tcg0vg3drui.31.77.112.167.sslip.io',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: PAYLOAD_SECRET environment variable is required in production!')
    }
    return 'dev_secret_localhostusak_payload_2026_x89a'
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
