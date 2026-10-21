import { createHmac } from 'crypto'

// Yalnızca geliştirme ortamında kullanılan sabit anahtar; production'da asla kullanılmaz.
const DEV_IP_HASH_SECRET = 'dev-only-ip-hash-secret'

type HeaderSource = { get(name: string): string | null } | Record<string, unknown> | undefined

function readHeader(headers: HeaderSource, name: string): string | null {
  if (!headers) return null
  if (typeof (headers as { get?: unknown }).get === 'function') {
    return (headers as { get(name: string): string | null }).get(name)
  }
  const value = (headers as Record<string, unknown>)[name] ?? (headers as Record<string, unknown>)[name.toLowerCase()]
  return typeof value === 'string' ? value : null
}

// İstemci IP'si. VARSAYIM: önde tek güvenilir proxy (Coolify/Traefik) var ve gerçek istemci
// IP'sini x-forwarded-for listesinin SONUNA ekliyor. İstemcinin kendi yazdığı sahte değerler
// listenin başında kalır, bu yüzden ilk değer değil son değer alınır.
export function getClientIp(headers: HeaderSource): string | null {
  const forwarded = readHeader(headers, 'x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return readHeader(headers, 'x-real-ip')?.trim() || null
}

export type IpHashResult = { ok: true; hash: string } | { ok: false; reason: string }

// Ham IP saklanmaz: gizli anahtarla HMAC-SHA256. Production'da CV_IP_HASH_SECRET zorunlu
// (yoksa ok:false → çağıran başvuruyu fail-closed reddeder).
export function hashClientIp(ip: string, env: NodeJS.ProcessEnv = process.env): IpHashResult {
  const secret = env.CV_IP_HASH_SECRET?.trim()
  if (!secret) {
    if (env.NODE_ENV === 'production') return { ok: false, reason: 'CV_IP_HASH_SECRET tanımlı değil' }
    return { ok: true, hash: createHmac('sha256', DEV_IP_HASH_SECRET).update(ip).digest('hex') }
  }
  return { ok: true, hash: createHmac('sha256', secret).update(ip).digest('hex') }
}
