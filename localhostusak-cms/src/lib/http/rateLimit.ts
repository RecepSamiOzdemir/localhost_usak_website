// Bellek içi kayan pencere sınırlayıcı (kısa süreli patlama koruması).
// Sınır: süreç belleğinde tutulur; redeploy'da sıfırlanır ve birden fazla container arasında
// paylaşılmaz. Kalıcı (günlük) sınırlar veritabanından hesaplanır. FAZ 7 de bunu kullanabilir.

export type RateLimitResult = { allowed: boolean; retryAfterMs: number }

export function createRateLimiter({
  windowMs,
  max,
  maxKeys = 5000,
}: {
  windowMs: number
  max: number
  maxKeys?: number
}) {
  const hits = new Map<string, number[]>()

  // Bellek şişmesini önlemek için süresi geçmiş anahtarları temizle
  const prune = (now: number) => {
    for (const [key, times] of hits) {
      if (times.length === 0 || now - times[times.length - 1] >= windowMs) hits.delete(key)
    }
  }

  return {
    check(key: string, now: number = Date.now()): RateLimitResult {
      if (hits.size > maxKeys) prune(now)

      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
      if (recent.length >= max) {
        hits.set(key, recent)
        return { allowed: false, retryAfterMs: windowMs - (now - recent[0]) }
      }
      recent.push(now)
      hits.set(key, recent)
      return { allowed: true, retryAfterMs: 0 }
    },
    size: () => hits.size,
  }
}
