// Test PDF üreticisi. Üretilen dosyalarda gerçek zararlı kod yoktur; yalnızca anahtar kelimeler.
import zlib from 'zlib'

export type PdfPart = string | Buffer

export function streamObj(dict: string, body: Buffer): Buffer {
  return Buffer.concat([
    Buffer.from(`<< ${dict} /Length ${body.length} >>\nstream\n`, 'latin1'),
    body,
    Buffer.from('\nendstream', 'latin1'),
  ])
}

export function buildPdf(objects: PdfPart[], trailerExtra = ''): Buffer {
  const chunks: Buffer[] = [Buffer.from('%PDF-1.7\n%\xe2\xe3\xcf\xd3\n', 'latin1')]
  const offsets: number[] = []
  let length = chunks[0].length
  objects.forEach((body, i) => {
    offsets.push(length)
    const chunk = Buffer.concat([
      Buffer.from(`${i + 1} 0 obj\n`, 'latin1'),
      typeof body === 'string' ? Buffer.from(body, 'latin1') : body,
      Buffer.from('\nendobj\n', 'latin1'),
    ])
    chunks.push(chunk)
    length += chunk.length
  })
  const xref =
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('') +
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R ${trailerExtra} >>\nstartxref\n${length}\n%%EOF\n`
  chunks.push(Buffer.from(xref, 'latin1'))
  return Buffer.concat(chunks)
}

// İkili veride rastlantısal "/JS" ve "/Launch" baytları içeren sayfa içeriği (yanlış pozitif kontrolü)
const pageContent = Buffer.concat([
  Buffer.from('BT /F1 12 Tf 72 712 Td (Fullstack Node/JS Developer) Tj ET\n', 'latin1'),
  Buffer.from([0x00, 0xff, 0x2f, 0x4a, 0x53, 0x20, 0x8a, 0x2f, 0x4c, 0x61, 0x75, 0x6e, 0x63, 0x68, 0x00]),
])

// Link, metadata ve sıkıştırılmış sayfa içeriği olan temiz CV benzeri nesneler (6 nesne)
export function cleanObjects(catalogExtra = ''): PdfPart[] {
  return [
    `<< /Type /Catalog /Pages 2 0 R ${catalogExtra} >>`,
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Annots [5 0 R] >>',
    streamObj('', zlib.deflateSync(pageContent)),
    '<< /Type /Annot /Subtype /Link /Rect [0 0 10 10] /A << /S /URI /URI (https://github.com/ornek) >> >>',
    '<< /Title (React/JavaScript - Node/JS) /Keywords (\\(/Launch\\) /EmbeddedFile) >>',
  ]
}

export const cleanPdf = () => buildPdf(cleanObjects(), '/Info 6 0 R')

// Red türlerine göre örnekler
export const activePdf = () => buildPdf([...cleanObjects('/OpenAction 7 0 R'), '<< /S /JavaScript /JS (app.alert\\(1\\)) >>'])
export const encryptedPdf = () => buildPdf([...cleanObjects(), '<< /Filter /Standard /V 2 /R 3 >>'], '/Encrypt 7 0 R')
export const embeddedPdf = () =>
  buildPdf([...cleanObjects('/Names << /EmbeddedFiles 7 0 R >>'), '<< /Type /EmbeddedFile /Subtype /application#2Fvnd.oasis.opendocument.text >>'])

// Görüntü kodeği içeren sentetik PDF (gerçek görüntü verisi yok; yalnızca /Filter anahtarı)
export const codecPdf = (filter: 'JBIG2Decode' | 'JPXDecode') =>
  buildPdf([
    ...cleanObjects(),
    streamObj(`/Type /XObject /Subtype /Image /Width 1 /Height 1 /BitsPerComponent 1 /Filter /${filter}`, Buffer.from([0, 1, 2, 3])),
  ])

// Toplam nesne sayısı `total` olan temiz PDF (6 gerçek nesne + boş sözlükler)
export const manyObjectsPdf = (total: number) =>
  buildPdf([...cleanObjects(), ...Array.from({ length: total - 6 }, () => '<< >>')], '/Info 6 0 R')

// `depth` düzey iç içe dizi içeren PDF
export const deepNestingPdf = (depth: number) =>
  buildPdf([...cleanObjects(), `${'['.repeat(depth)}${']'.repeat(depth)}`], '/Info 6 0 R')
