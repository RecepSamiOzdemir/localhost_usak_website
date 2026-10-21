import { NextRequest, NextResponse } from 'next/server'

// ─── Basit bellek cache'i ───────────────────────────────────────────────────
// Production'da Redis veya Payload'un cache mekanizması kullanılabilir
let cache: {
  data: InstagramPost[] | null
  fetchedAt: number
} = { data: null, fetchedAt: 0 }

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 dakika

// Eksik env uyarısını süreç başına yalnızca bir kez logla
let hasWarnedMissingCredentials = false

export interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string // VIDEO tipi için
  permalink: string
  caption?: string
  timestamp: string
}

// ─── CORS ────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://localhostusak.tech',
  'https://www.localhostusak.tech',
  process.env.WEB_URL,
  process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : undefined,
].filter((origin): origin is string => Boolean(origin))

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin')
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

// ─── GET /api/instagram/posts ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!token || !userId) {
    if (!hasWarnedMissingCredentials) {
      console.warn('[Instagram API] INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_USER_ID tanımlı değil — CMS ortam değişkenleri eksik')
      hasWarnedMissingCredentials = true
    }
    return NextResponse.json({ posts: [], configured: false }, { status: 200, headers })
  }

  // Cache geçerliyse direkt dön
  const now = Date.now()
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ posts: cache.data, cached: true }, { headers })
  }

  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=3&access_token=${token}`

    const res = await fetch(url, { next: { revalidate: 900 } }) // 15 dk Next.js cache

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[Instagram API] Error:', res.status, errBody)
      // Token geçersizse cache'deki eski veriyi dön
      if (cache.data) {
        return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
      }
      return NextResponse.json(
        { error: 'Instagram API error' },
        { status: 502, headers }
      )
    }

    const json = await res.json()
    const posts: InstagramPost[] = json.data ?? []

    // Cache güncelle
    cache = { data: posts, fetchedAt: now }

    return NextResponse.json({ posts, cached: false }, { headers })
  } catch (err) {
    console.error('[Instagram API] Fetch failed:', err)
    if (cache.data) {
      return NextResponse.json({ posts: cache.data, cached: true, stale: true }, { headers })
    }
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500, headers }
    )
  }
}

// OPTIONS — preflight için
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  })
}
