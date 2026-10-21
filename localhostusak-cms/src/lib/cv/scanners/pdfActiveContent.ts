import zlib from 'zlib'

import {
  PDF_MAX_NESTING_DEPTH,
  PDF_OBJECT_MAX_COUNT,
  PDF_OBJECT_WARN_COUNT,
  PDF_RISKY_CODEC_ACTION,
} from '../limits'
import type { CvScanner, ScanVerdict, ScanWarningCode } from './types'

// PDF içinde aktif içerik (gömülü JavaScript, dış program çalıştırma, gömülü dosya vb.) arar.
// Bu bir antivirüs değildir: bilinen tehlikeli PDF anahtar kelimelerini (pdfid listesi) yakalar.
// Belirsiz her durumda (bozuk yapı, şifreli dosya, açılamayan nesne akışı) red döner.

// Aktif içerik anahtarları → "active". /URI, /AcroForm, /OpenAction tek başına serbest:
// CV'lerde link ve sayfa görünüm ayarı yaygındır; tehlikeli eylem türleri zaten bu
// anahtarlarla (/JS, /JavaScript, /Launch …) işaretlenir.
const ACTIVE_KEYS = ['JS', 'JavaScript', 'Launch', 'RichMedia', 'XFA', 'ImportData', 'SubmitForm'] as const
// Gömülü dosya anahtarları → "embedded" (ör. LibreOffice hibrit PDF). Kararla reddedilir.
const EMBEDDED_KEYS = ['EmbeddedFile', 'EmbeddedFiles'] as const
// Riskli görüntü kodekleri: eşik/davranış limits.ts içinde (PDF_RISKY_CODEC_ACTION)
const CODEC_KEYS = { JBIG2Decode: 'jbig2', JPXDecode: 'jpx' } as const satisfies Record<string, ScanWarningCode>

// Açılan nesne akışlarının toplam boyut sınırı (zip-bomb koruması)
const MAX_INFLATED_BYTES = 20 * 1024 * 1024
// Yapısal kontrol penceresi (Payload'ın validatePDF'iyle aynı: dosya sonundaki 1 KB)
const EOF_WINDOW = 1024
const TIMEOUT_MESSAGE = 'tarama zaman aşımı'

// PDF isim karakter kümesi dışındaki ayraçlar
const NAME_RE = /\/[^\s/[\]<>(){}%]+/g

// "/J#53" gibi #xx kodlamalı isimleri çözer; gizleme tekniğine karşı.
function normalizeNames(text: string): string {
  return text.replace(NAME_RE, (name) =>
    name.includes('#')
      ? name.replace(/#([0-9A-Fa-f]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
      : name,
  )
}

// "(…)" string literallerini boşaltır: başlık/anahtar kelime gibi metinlerdeki "Node/JS" ifadeleri
// anahtar sanılmasın. Ters bölü kaçışı ve iç içe parantez dikkate alınır. Anahtarlar string dışında kalır.
function stripLiteralStrings(text: string): string {
  let out = ''
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (depth === 0) {
      if (ch === '(') {
        depth = 1
        out += '('
      } else {
        out += ch
      }
      continue
    }
    if (ch === '\\') {
      i++ // kaçışlı karakteri atla
    } else if (ch === '(') {
      depth++
    } else if (ch === ')') {
      depth--
      if (depth === 0) out += ')'
    }
  }
  return out
}

type StreamInfo = { dict: string; bodyStart: number; bodyEnd: number }

// "stream … endstream" gövdelerini ve hemen önlerindeki sözlüğü bulur.
function findStreams(text: string): StreamInfo[] {
  const streams: StreamInfo[] = []
  const re = /stream\r?\n/g
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    // "endstream" içindeki "stream" eşleşmesini atla
    if (text.slice(Math.max(0, match.index - 3), match.index) === 'end') continue
    const bodyStart = match.index + match[0].length
    const bodyEnd = text.indexOf('endstream', bodyStart)
    if (bodyEnd === -1) throw new Error('kapanmamış stream')
    const objStart = text.lastIndexOf('obj', match.index)
    const dict = text.slice(objStart === -1 ? Math.max(0, match.index - 4096) : objStart, match.index)
    streams.push({ dict, bodyStart, bodyEnd })
    re.lastIndex = bodyEnd + 'endstream'.length
  }
  return streams
}

function findKeys(text: string, keys: readonly string[]): string[] {
  // Anahtarın ardından isim karakteri gelmemeli (/JS ≠ /JSON)
  return keys.filter((key) => new RegExp(`/${key}(?![A-Za-z0-9#])`).test(text)).map((key) => `/${key}`)
}

// Bulunan anahtarlardan red türünü seçer. Öncelik: active > encrypted > embedded
function verdictFor(text: string, encrypted: boolean): ScanVerdict {
  const active = findKeys(text, ACTIVE_KEYS)
  if (active.length > 0) return { ok: false, code: 'active', reasons: active }
  if (encrypted) return { ok: false, code: 'encrypted', reasons: ['/Encrypt'] }
  const embedded = findKeys(text, EMBEDDED_KEYS)
  if (embedded.length > 0) return { ok: false, code: 'embedded', reasons: embedded }
  return { ok: true, reasons: [] }
}

// Gerçek nesne sayısı: "N G obj" başlıkları + nesne akışlarının bildirdiği /N. (/Size güvenilmez.)
function countObjects(dictText: string, objStmCounts: number): number {
  return (dictText.match(/\d+\s+\d+\s+obj\b/g)?.length ?? 0) + objStmCounts
}

// Sözlük/dizi iç içe derinliği. Metin string'leri önceden boşaltılmış olmalı. "endobj" derinliği
// sıfırlar: bir nesnedeki dengesiz parantez sonraki nesnelerin derinliğini şişirmesin.
function maxNestingDepth(text: string): number {
  let depth = 0
  let max = 0
  for (const token of text.matchAll(/<<|>>|\[|\]|endobj/g)) {
    switch (token[0]) {
      case '<<':
      case '[':
        depth++
        if (depth > max) max = depth
        break
      case 'endobj':
        depth = 0
        break
      default:
        if (depth > 0) depth--
    }
  }
  return max
}

function inspect(input: Buffer, deadline: number): ScanVerdict {
  const raw = input.toString('latin1')

  if (!raw.startsWith('%PDF-')) return { ok: false, code: 'invalid', reasons: ['PDF başlığı yok'] }
  if (!raw.slice(-EOF_WINDOW).includes('%%EOF')) {
    return { ok: false, code: 'invalid', reasons: ['PDF sonu (%%EOF) yok'] }
  }

  const streams = findStreams(raw)

  // Stream gövdeleri (font, görsel, sayfa çizimi) ham haliyle taranmaz: ikili veride rastlantısal
  // "/JS" baytları yanlış pozitif üretir. Anahtarlar sözlüklerde ve nesne akışlarında aranır.
  let dictionaries = ''
  let cursor = 0
  for (const s of streams) {
    dictionaries += raw.slice(cursor, s.bodyStart)
    cursor = s.bodyEnd
  }
  dictionaries += raw.slice(cursor)
  const dictText = normalizeNames(stripLiteralStrings(dictionaries))

  // Şifreli PDF'te nesne akışları da şifrelidir, açılamaz; sözlüklere bakıp hemen karar ver.
  // (/Encrypt, klasik trailer'da veya xref akışı sözlüğünde bulunur; ikisi de burada.)
  if (/\/Encrypt(?![A-Za-z0-9#])/.test(dictText)) return verdictFor(dictText, true)

  const segments: string[] = [dictText]
  let objStmObjects = 0

  // Nesne akışları (/Type /ObjStm) sözlükleri sıkıştırılmış saklar; açılıp taranır.
  let inflatedTotal = 0
  for (const s of streams) {
    if (Date.now() > deadline) throw new Error(TIMEOUT_MESSAGE)
    const dict = normalizeNames(s.dict)
    if (!/\/Type\s*\/ObjStm/.test(dict)) continue

    const body = input.subarray(s.bodyStart, s.bodyEnd)
    let content: Buffer
    if (/\/Filter\s*\/FlateDecode/.test(dict) || /\/Filter\s*\[\s*\/FlateDecode\s*\]/.test(dict)) {
      content = zlib.inflateSync(body, { maxOutputLength: MAX_INFLATED_BYTES - inflatedTotal })
    } else if (!/\/Filter/.test(dict)) {
      content = body
    } else {
      // Zincirli/alışılmadık filtre: içerik denetlenemez → red
      return { ok: false, code: 'invalid', reasons: ['desteklenmeyen filtreli nesne akışı'] }
    }
    objStmObjects += Number(/\/N\s+(\d+)/.exec(dict)?.[1] ?? 0)
    inflatedTotal += content.length
    if (inflatedTotal >= MAX_INFLATED_BYTES) {
      return { ok: false, code: 'invalid', reasons: ['açılan içerik sınırı aşıldı'] }
    }
    segments.push(normalizeNames(stripLiteralStrings(content.toString('latin1'))))
  }

  const joined = segments.join('\n')
  // Öncelik: active > encrypted > embedded; sınırlar ve uyarılar yalnızca bunlardan sonra bakılır
  const verdict = verdictFor(joined, false)
  if (!verdict.ok) return verdict

  // Nesne sayısı ve iç içe derinlik aşımı: net red (genel mesaj)
  const objectCount = countObjects(dictText, objStmObjects)
  if (objectCount > PDF_OBJECT_MAX_COUNT) {
    return { ok: false, code: 'invalid', reasons: [`nesne sayısı sınırı aşıldı (${objectCount})`] }
  }
  const depth = Math.max(...segments.map(maxNestingDepth))
  if (depth > PDF_MAX_NESTING_DEPTH) {
    return { ok: false, code: 'invalid', reasons: [`iç içe derinlik sınırı aşıldı (${depth})`] }
  }

  const codecs = findKeys(joined, Object.keys(CODEC_KEYS))
  if (codecs.length > 0 && PDF_RISKY_CODEC_ACTION === 'reject') {
    return { ok: false, code: 'scanned_pdf', reasons: codecs }
  }

  // Reddetmeyen sinyaller: yalnızca loglanır
  const warnings: ScanWarningCode[] = codecs.map((key) => CODEC_KEYS[key.slice(1) as keyof typeof CODEC_KEYS])
  if (objectCount > PDF_OBJECT_WARN_COUNT) warnings.push('many_objects')
  return { ok: true, reasons: [], warnings }
}

export function inspectPdf(input: Buffer, deadline: number): ScanVerdict {
  try {
    return inspect(input, deadline)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // Zaman aşımı tarama hatasıdır (scan_error); diğer ayrıştırma hataları bozuk PDF demektir.
    if (message === TIMEOUT_MESSAGE) throw error
    return { ok: false, code: 'invalid', reasons: [`ayrıştırma hatası: ${message}`] }
  }
}

export const pdfActiveContentScanner: CvScanner = {
  name: 'pdf-active-content',
  async scan(input, deadline) {
    return inspectPdf(input, deadline)
  },
}
