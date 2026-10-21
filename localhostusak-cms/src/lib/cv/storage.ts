import { constants as fsConstants } from 'fs'
import fs from 'fs/promises'
import path from 'path'

// Geliştirme ortamında CV_STORAGE_DIR yoksa kullanılan yerel dizin (.gitignore'da).
// Production'da bu dizine ASLA düşülmez.
export const DEV_CV_STORAGE_DIR = 'cv-applications'

export type CvStorageResolution =
  | { ok: true; dir: string }
  | { ok: false; reason: string }

// CV dosyalarının yazılacağı dizini ortama göre belirler.
// Production: CV_STORAGE_DIR zorunlu ve mutlak yol olmalı; aksi halde ok:false (fail-closed).
export function resolveCvStorageDir(env: NodeJS.ProcessEnv = process.env): CvStorageResolution {
  const configured = env.CV_STORAGE_DIR?.trim()
  const isProduction = env.NODE_ENV === 'production'

  if (configured) {
    if (isProduction && !path.isAbsolute(configured)) {
      return { ok: false, reason: `CV_STORAGE_DIR mutlak yol olmalı (verilen: ${configured})` }
    }
    return { ok: true, dir: configured }
  }

  if (isProduction) {
    return { ok: false, reason: 'CV_STORAGE_DIR tanımlı değil' }
  }

  return { ok: true, dir: DEV_CV_STORAGE_DIR }
}

// Dizin yoksa oluşturur ve yazılabilir olduğunu doğrular. Hata mesajı yalnızca dönüş değerindedir;
// çağıran, loga yol/ayrıntı değil yalnızca sebep kodu yazar.
export async function ensureWritableDir(dir: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    await fs.mkdir(dir, { recursive: true })
    await fs.access(dir, fsConstants.W_OK)
    return { ok: true }
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) }
  }
}
