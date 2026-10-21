import { pdfActiveContentScanner } from './pdfActiveContent'
import type { CvScanner } from './types'

// Etkin tarayıcılar; sırayla çalışır ve hepsi "temiz" demelidir.
// ClamAV eklenecekse: scanners/clamav.ts yazılıp buraya eklenir.
export const defaultScanners: CvScanner[] = [pdfActiveContentScanner]
