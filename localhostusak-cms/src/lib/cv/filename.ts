import { randomBytes } from 'crypto'

// Diskteki CV dosya adı: aday adı veya orijinal dosya adından hiçbir parça içermez.
// Biçim (ROADMAP örneğiyle uyumlu): cv_<16 hex rastgele>_<epoch saniye>.pdf
export function cvFilename(now: Date = new Date()): string {
  return `cv_${randomBytes(8).toString('hex')}_${Math.floor(now.getTime() / 1000)}.pdf`
}

export const CV_FILENAME_RE = /^cv_[0-9a-f]{16}_\d{10,}\.pdf$/
