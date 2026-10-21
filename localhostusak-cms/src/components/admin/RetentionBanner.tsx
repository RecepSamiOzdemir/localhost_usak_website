import type { BeforeListTableServerProps } from 'payload'
import { Banner } from '@payloadcms/ui'
import React from 'react'

import { resolveRetentionYears, retentionCutoff } from '../../lib/cv/retention'

// İş Başvuruları liste ekranının üstünde yalnızca UYARI gösterir (sunucu bileşeni).
// Hiçbir kaydı silmez veya değiştirmez; silme her zaman yönetici tarafından elle yapılır.
// Hata olursa banner gizlenir, liste ekranı çalışmaya devam eder.

const COLLECTION = 'job-applications'
const SETTINGS_GLOBAL = 'careers-page-settings'

export const RetentionBanner = async ({ payload }: BeforeListTableServerProps) => {
  try {
    const settings = await payload.findGlobal({ slug: SETTINGS_GLOBAL, depth: 0 })
    const years = resolveRetentionYears(
      (settings as { applicationForm?: { retentionYears?: number | null } }).applicationForm?.retentionYears,
    )
    const cutoffIso = retentionCutoff(years).toISOString()

    const [expired, fresh] = await Promise.all([
      payload.count({ collection: COLLECTION, where: { consentAt: { less_than: cutoffIso } } }),
      payload.count({ collection: COLLECTION, where: { status: { equals: 'new' } } }),
    ])

    if (expired.totalDocs === 0 && fresh.totalDocs === 0) return null

    const listUrl = `${payload.config.routes.admin}/collections/${COLLECTION}`

    return (
      <div style={{ display: 'grid', gap: 'calc(var(--base) / 2)', marginBottom: 'var(--base)' }}>
        {expired.totalDocs > 0 && (
          <Banner
            type="error"
            to={`${listUrl}?where[consentAt][less_than]=${encodeURIComponent(cutoffIso)}`}
          >
            {expired.totalDocs} CV saklama süresini doldurdu ({years} yıl). Listelemek için tıklayın; silme
            işlemini elle yapın.
          </Banner>
        )}
        {fresh.totalDocs > 0 && (
          <Banner type="info" to={`${listUrl}?where[status][equals]=new`}>
            {fresh.totalDocs} yeni başvuru
          </Banner>
        )}
      </div>
    )
  } catch (err) {
    payload.logger.error({ err }, '[cv] saklama uyarısı hesaplanamadı')
    return null
  }
}

export default RetentionBanner
