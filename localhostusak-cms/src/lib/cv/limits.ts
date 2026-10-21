// CV yükleme sınırları — tek kaynak (koleksiyon hook'u ve başvuru endpoint'i burayı kullanır)
export const MAX_CV_BYTES = 5 * 1024 * 1024 // 5 MB (ROADMAP FAZ 6)

// --- PDF tarayıcı eşikleri (scanners/pdfActiveContent.ts) ---------------------------------------
// Aşağıdaki sayılar TAHMİNİ eşiklerdir: ölçülen en yüksek değerler nesne 151, derinlik 4 idi
// (11 örnek CV; Word/Pages/Canva/LinkedIn çıktıları ölçülmedi). Log toplandıkça gözden geçirin.

// Gerçek nesne sayısı (nesne başlıkları + nesne akışlarındaki nesneler; /Size değil, o güvenilmez)
export const PDF_OBJECT_WARN_COUNT = 3_000 // aşılırsa yalnızca uyarı loglanır
export const PDF_OBJECT_MAX_COUNT = 20_000 // aşılırsa red (invalid)

// Sözlük/dizi (<< >> ve [ ]) iç içe derinliği; aşılırsa red (invalid). Meşru PDF'lerde tek haneli.
export const PDF_MAX_NESTING_DEPTH = 32

// JBIG2/JPX (taranmış belge kodekleri) görüntüleyicilerde geçmişte açık çıkaran kod yolları.
// 'reject': 'scanned_pdf' koduyla reddedilir (13 Ekim 2026 kararı; taranmış/fotoğraf tabanlı CV'ler
// yeniden PDF'e aktarılarak yüklenir). 'warn': yalnızca uyarı loglanır. Değiştirmek için bu sabit yeterlidir.
export type RiskyCodecAction = 'warn' | 'reject'
export const PDF_RISKY_CODEC_ACTION: RiskyCodecAction = 'reject'
