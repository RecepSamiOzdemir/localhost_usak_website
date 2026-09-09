# localhostusak — Modern Tasarım Dili (Cyber-Local / Dark Tech HUD)

> **Tasarım Konsepti:** Uşak'ın yerel coğrafi ve tarihi dokusunu (Blaundus Antik Kenti, Cilandiras Kanyonu, Tarihi Saat Kulesi) modern yazılım dünyasının karanlık terminal ve neon-HUD estetiğiyle buluşturan fütüristik, profesyonel ve topluluk odaklı bir tasarım dili.

---

## 1. Tasarım Felsefesi ve Kimlik

Modern tasarım dili, **"Yerel Güç, Evrensel Teknoloji"** vizyonunu temsil eder. Yazılımcılar, tasarımcılar, ürün geliştiriciler ve mühendisler için ciddi, dinamik, ilham verici ve merak uyandıran bir dijital alan kurar.

- **Anahtar Duygular:** Profesyonel, merak uyandırıcı, keskin, akışkan, teknolojik ve aidiyet hissettiren.
- **Karakteristik Detaylar:**
  - Devre kartı (PCB trace) hatları ve 45 derecelik köşe dönüşleri
  - Glowing (ışıldayan) terminal düğümleri ve bağlantı noktaları
  - Terminal komut satırı ve kod sözdizimi metaforları (`>_`, `{}`, `</>`, `// yorumlar`)
  - Nokta matrisi (dot-grid) dokuları ve cam efekti (glassmorphism)
  - Uşak'ın ikonik mekanlarının karanlık/gece atmosferli sinematik fotoğrafları

---

## 2. Renk Paleti (Color Tokens)

Koyu mod odaklı, yüksek kontrastlı ve enerjik turuncu vurgularla dengelenmiş bir renk hiyerarşisi kullanılır.

### 2.1. Temel Renkler
| Token Adı | HEX Kodu | RGB / HSL | Kullanım Alanı |
|---|---|---|---|
| `--bg-primary` | `#080A0D` | `rgb(8, 10, 13)` | Sayfa ana gövde arka planı (derin siyah/obsidyen) |
| `--bg-secondary` | `#0F1318` | `rgb(15, 19, 24)` | Kart, modal ve bölüm konteyner arka planları |
| `--bg-glass` | `rgba(15, 19, 24, 0.72)` | — | `backdrop-filter: blur(16px)` ile yarı saydam yüzeyler |
| `--surface-elevated` | `#171C24` | `rgb(23, 28, 36)` | Hover durumları, üst katman kartlar |

### 2.2. Vurgu ve Işıma Renkleri (Accents & Glows)
| Token Adı | HEX Kodu | Açıklama |
|---|---|---|
| `--accent-orange` | `#FF6600` | Markanın ana turuncusu (Logo, aktif butonlar, kilit metinler) |
| `--accent-orange-glow`| `rgba(255, 102, 0, 0.35)` | Neon buton ve kart ışıma gölgeleri (`box-shadow`) |
| `--accent-amber` | `#FFA133` | İkincil turuncu/bal tonu (Hover durumları, gradient geçişleri) |
| `--accent-laser-blue` | `#00E5FF` | Blaundus gökyüzü huzmesi esintisi (İkincil odak, linkler, kod tagleri) |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)`| Pasif kart kenarlıkları |
| `--border-circuit` | `rgba(255, 102, 0, 0.45)` | Devre hatları ve aktif kart kenarlıkları |

### 2.3. Tipografi Renkleri
| Token Adı | HEX Kodu | Kullanım |
|---|---|---|
| `--text-primary` | `#F8FAFC` | Başlıklar, birincil metinler (%100 okunabilirlik) |
| `--text-secondary` | `#94A3B8` | Açıklamalar, gövde metinleri, meta bilgiler |
| `--text-muted` | `#64748B` | Telif hakları, pasif etiketler, terminal yorumları |
| `--text-code` | `#FFA133` | Monospace kod parçacıkları, keywordler |

---

## 3. Tipografi Sistemi

Modern ve teknolojik bir atmosfer için geometrik sans-serif ana yazı tipi, geliştirici kimliğini pekiştirmek için ise monospace kod yazı tipi harmanlanır.

### 3.1. Font Aileleri
- **Birincil Başlık Fontu:** `Outfit`, `Space Grotesk` veya `Plus Jakarta Sans`
  - Ağırlıklar: `600 (SemiBold)`, `700 (Bold)`, `800 (ExtraBold)`
  - Harf aralığı (letter-spacing): Başlıklarda `-0.02em` ile `-0.03em`
- **Gövde Metni (Body):** `Inter` veya `Plus Jakarta Sans`
  - Ağırlıklar: `400 (Regular)`, `500 (Medium)`
  - Satır yüksekliği (line-height): `1.6`
- **Kod ve Terminal Elemanları:** `JetBrains Mono` veya `Fira Code`
  - Ağırlıklar: `400 (Regular)`, `600 (SemiBold)`

### 3.2. Hiyerarşik Ölçek
```css
--font-h1: clamp(2.5rem, 5vw, 4.2rem);   /* Ana karşılama başlığı */
--font-h2: clamp(1.8rem, 3.5vw, 2.75rem); /* Bölüm başlıkları */
--font-h3: 1.4rem;                       /* Kart başlıkları */
--font-body: 1.05rem;                    /* Okuma metinleri */
--font-small: 0.875rem;                  /* Alt bilgiler, etiketler */
--font-code: 0.95rem;                    /* Terminal ve kod blokları */
```

---

## 4. UI Bileşenleri ve Tasarım Öğeleri

Referans afişlerde (`781425455`, `781425466`, `WhatsApp Image 2026-09-05`, `3368413859`) görülen imza öğeler:

### 4.1. Devre Kartı Hatları & Akış Göstergeleri (Circuit Traces)
- Kartların köşelerinden veya yan çizgilerinden çıkan 45 derecelik açılı turuncu çizgiler (`stroke: 1.5px`).
- Çizgi uçlarında parıldayan dairesel düğümler (Nodes):
  ```css
  .circuit-node {
    width: 8px;
    height: 8px;
    background: var(--accent-orange);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--accent-orange);
  }
  ```

### 4.2. Terminal Prompt ve Kod Blokları
- Bölüm başlıkları ve açıklamalar terminal sözdizimi ile zenginleştirilir:
  - `>_ connect • build • collaborate • grow`
  - `// birlikte daha güçlü`
  - `community = impact;`
- Kod bloğu pencerelerinde sol üstte 3 nokta kontrol düğmesi (`○ ○ ○`).

### 4.3. HUD Rozetleri ve Lokasyon Pill'leri
- Örnek: `[ 📍 U Ş A K ]`
  - Siyah cam zemin, ince turuncu kenarlık, geniş harf aralığı (`letter-spacing: 0.25em`).

### 4.4. Butonlar (CTA)
1. **Primary Button (Glow/Cyber CTA):**
   - Zemin: `var(--accent-orange)`
   - Metin: Beyaz / Kalın
   - Efekt: Hover'da `box-shadow: 0 0 24px rgba(255, 102, 0, 0.55)`, `transform: translateY(-2px)`
2. **Secondary / Terminal Button:**
   - Zemin: Şeffaf / Cam zemin
   - Kenarlık: `1px solid var(--accent-orange)`
   - Solunda terminal prefixi: `>_ Topluluğa Katıl`

### 4.5. Kart Tasarımı (Feature & Info Cards)
- Sol tarafta sıralı ikon blokları (`</>`, `{}`, `>_`, `🎯`, `🚀`).
- Koyu füme cam zemin (`backdrop-filter: blur(12px)`).
- İnce dikey timeline bağlantı çizgisi (kartları birbirine bağlayan dikey akış çizgisi).

---

## 5. Arka Plan ve Atmosfer

- **Görsel Katman:** Uşak'ın antik ve doğal silüetleri (Blaundus dikilitaşları, Cilandiras köprüsü, gece saat kulesi) CSS `mix-blend-mode: luminosity` veya `radial-gradient(ellipse at top, rgba(255,102,0,0.12), transparent 70%)` ile sayfa zeminine entegre edilir.
- **Nokta Matrisi (Dot Matrix Grid):** Kart köşelerinde veya bölüm geçişlerinde 4x4 veya 6x6 matris turuncu noktalar (`grid of dots`).

---

## 6. Örnek CSS Değişkenleri ve Reset Şablonu

```css
:root {
  --bg-primary: #080A0D;
  --bg-secondary: #0F1318;
  --bg-card: rgba(15, 19, 24, 0.75);
  --border-color: rgba(255, 255, 255, 0.08);
  --border-active: #FF6600;
  
  --accent-primary: #FF6600;
  --accent-glow: rgba(255, 102, 0, 0.4);
  --accent-blue: #00E5FF;
  
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-dim: #64748B;
  
  --font-main: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

---

## 7. Önerilen Kütüphaneler ve Web Araçları (`Web_Gelistirme_Araclari_Rehberi.md` Referansı)

Modern Cyber HUD arayüzünü hayata geçirirken rehberdeki şu spesifik araçlardan yararlanılır:

- 🌌 **React Bits (`reactbits.dev`):**
  - `Galaxy` ve `Cubes` bileşenleri; Blaundus gökyüzü ve kanyon temalı Hero alanında fareye duyarlı derinlikli arka plan simülasyonu için kullanılır.
- 📟 **Dotmatrix Loaders (`dotmatrix.zzzzshawn.cloud`):**
  - Devre kartı ve terminal estetiğini tamamlayan, LED nokta matrisi formunda yükleme ve veri akış animasyonları.
- 🌊 **ShaderGradient (`ruucm/shadergradient`):**
  - Koyu obsidyen zemin üzerinde turuncu ve mavi ışık dalgalarının süzüldüğü akışkan WebGL gradyanları.
- 💎 **liquid-glass-js:**
  - Glassmorphic kartların üzerine gelindiğinde Apple Vision Pro tarzı sıvı cam ışık kırılmaları ve parlama efektleri.
- 🔤 **Colorion Text Effects:**
  - Başlıklarda ve terminal komut satırlarında saf CSS ile çalışan Glitch ve Cyber Neon tipografi efektleri.
- 🎯 **ItsHover (`itshover.com`):**
  - Terminal, kod tagleri (`</>`), lokasyon pinleri ve topluluk ikonları için niyet odaklı canlı SVG mikro etkileşimleri.
