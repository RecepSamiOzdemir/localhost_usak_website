import { MAX_CV_BYTES } from './limits'
import { defaultScanners } from './scanners'
import type { CvScanner, ScanResult, ScanWarningCode } from './scanners/types'

export type { ScanResult, ScanResultCode, ScanWarningCode } from './scanners/types'

const DEFAULT_TIMEOUT_MS = 5000

// Süre dolarsa reddeden Promise yarışı (asenkron tarayıcılar, ör. ileride ClamAV için)
function withDeadline<T>(promise: Promise<T>, deadline: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('tarama zaman aşımı')), Math.max(0, deadline - Date.now()))
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

// CV dosyasını tüm tarayıcılardan geçirir. Fail-closed: boyut aşımı, hata, zaman aşımı
// veya herhangi bir tarayıcının "temiz değil" demesi → ok:false.
export async function scanCv(
  input: Buffer,
  options: { scanners?: CvScanner[]; timeoutMs?: number } = {},
): Promise<ScanResult> {
  const scanners = options.scanners ?? defaultScanners
  const deadline = Date.now() + (options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const engines: string[] = []
  const warnings: ScanWarningCode[] = []

  if (input.length === 0) return { ok: false, code: 'invalid', engines, warnings, reasons: ['boş dosya'] }
  if (input.length > MAX_CV_BYTES) return { ok: false, code: 'too_large', engines, warnings, reasons: ['boyut sınırı aşıldı'] }
  // Tarayıcı listesi boşsa "temiz" sayılmaz
  if (scanners.length === 0) return { ok: false, code: 'scan_error', engines, warnings, reasons: ['etkin tarayıcı yok'] }

  for (const scanner of scanners) {
    try {
      const verdict = await withDeadline(scanner.scan(input, deadline), deadline)
      engines.push(scanner.name)
      if (!verdict.ok) {
        return {
          ok: false,
          code: verdict.code,
          engines,
          warnings,
          reasons: verdict.reasons.map((r) => `${scanner.name}: ${r}`),
        }
      }
      for (const warning of verdict.ok ? (verdict.warnings ?? []) : []) {
        if (!warnings.includes(warning)) warnings.push(warning)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, code: 'scan_error', engines, warnings, reasons: [`${scanner.name}: hata (${message})`] }
    }
  }

  return { ok: true, code: 'clean', engines, warnings, reasons: [] }
}
