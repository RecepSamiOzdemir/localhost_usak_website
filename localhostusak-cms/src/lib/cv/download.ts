import type { PayloadRequest } from 'payload'

// CV dosyası indirme sertleştirmesi (Aşama 5).
// Dosya servisi (/api/job-applications/file/...) erişim kontrolünü koleksiyonun read kuralıyla
// yapar (giriş yapmamış kullanıcı 403 alır); burası yalnızca başlıkları ve erişim logunu ekler.

// PDF tarayıcıda satır içi açılmasın, her zaman indirilsin; önbelleğe alınmasın
export const hardenCvResponseHeaders = ({ headers }: { headers: Headers }): Headers => {
  headers.set('Content-Disposition', 'attachment')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Cache-Control', 'private, no-store')
  return headers
}

// Her dosya isteğinde tek log satırı: yalnızca kullanıcı id'si, başvuru id'si ve zaman.
// Ad, e-posta, IP ve dosya adı yazılmaz. Hiçbir şey döndürmez, yani Response vermez (dosya akışı devam eder);
// log hatası indirmeyi engellemez.
export const logCvDownload = async (
  req: PayloadRequest,
  { params }: { params: { filename: string } },
): Promise<void> => {
  try {
    // Erişim kuralı true döndüğünde Payload doc'u iletmez; başvuruyu rastgele dosya adından buluruz
    const found = await req.payload.find({
      collection: 'job-applications',
      where: { filename: { equals: params.filename } },
      limit: 1,
      depth: 0,
      pagination: false,
      select: {},
      overrideAccess: true,
    })
    const applicationId = found.docs[0]?.id ?? 'unknown'
    req.payload.logger.info(
      `[cv] indirme kullanici=${req.user?.id ?? 'unknown'} basvuru=${applicationId} zaman=${new Date().toISOString()}`,
    )
  } catch {
    req.payload.logger.warn('[cv] indirme logu yazılamadı')
  }
}
