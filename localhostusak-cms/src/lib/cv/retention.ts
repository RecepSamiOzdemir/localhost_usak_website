// CV saklama süresi — tek kaynak (Karar 1, 5 Ekim 2026).
// Son kullanma tarihi kayda yazılmaz; her seferinde consentAt + retentionYears ile hesaplanır.
// Böylece süre CMS'ten değişince eski kayıtlar bozulmaz. Otomatik silme YOKTUR; yalnızca uyarı verilir.

export const DEFAULT_RETENTION_YEARS = 2
export const MIN_RETENTION_YEARS = 1
export const MAX_RETENTION_YEARS = 10

// CMS'ten gelen değer boş/geçersizse varsayılana düşülür (global henüz kaydedilmemiş olabilir)
export const resolveRetentionYears = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) return DEFAULT_RETENTION_YEARS
  if (value < MIN_RETENTION_YEARS || value > MAX_RETENTION_YEARS) return DEFAULT_RETENTION_YEARS
  return value
}

// consentAt bu tarihten önceyse saklama süresi dolmuştur
export const retentionCutoff = (years: number, now: Date = new Date()): Date => {
  const cutoff = new Date(now.getTime())
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - years)
  return cutoff
}
