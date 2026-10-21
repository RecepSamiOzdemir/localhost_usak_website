# localhostusak — Profesyonel Tasarım Sistemi & Kuralları (Glassmorphism & Premium UI)

> **Tasarım İlkesi:** Uşak'ın yerel teknoloji ekosistemini küresel standartlarda temsil eden; aşırı neon veya çiğ renklerden arındırılmış, krem/arşiv estetiği ve derin arduvaz tonlarıyla harmanlanmış, rafine glassmorphism ve editoryal tipografi odaklı profesyonel tasarım sistemi.

---

## 1. Altın Kurallar (Core Design Rules)

1. **🚫 Saf Siyah (`#000000`) ve Saf Beyaz (`#FFFFFF`) YASAKTIR:**
   - Dijital arayüzlerde saf siyah ve beyaz çiğ, göz yorucu ve kurumsallıktan uzak bir kontrast oluşturur.
   - **Aydınlık Temada (Light Mode):** Arka plan saf beyaz değil; **sıcak krem, fildişi ve eggshell** (`#FBF9F5`, `#F5F2EB`) tonlarında olmalıdır. Metinler saf siyah değil; **derin kömür/antrasit** (`#1A1D23`) olmalıdır.
   - **Karanlık Temada (Dark Mode):** Arka plan saf siyah değil; **derin arduvaz, obsidyen ve füme** (`#0B0D12`, `#11141B`, `#161B24`) olmalıdır. Metinler saf beyaz değil; **kırık fildişi/krem** (`#F4F2EE`) olmalıdır.

2. **🎨 Çiğ/Neon Renkler Yerine Rafine & Premium Tonlar:**
   - Buton ve rozetlerde göze batan cart yeşil (`#00FF00`) veya bağırıcı neon turuncu (`#FF5500`) kullanılmaz.
   - Renkler doymuşlukları dengelenmiş, sofistike ve editoryal tonlardan seçilir (Sunset Terracotta, Warm Amber, Sage/Forest Slate, Muted Cobalt).

3. **💎 Glassmorphism & Yüzey Derinliği:**
   - Yüzeylerde keskin opak bloklar yerine hafif yarı saydamlık (`rgba(...)`), ince arka plan bulanıklığı (`backdrop-filter: blur(12px - 20px)`) ve çok ince ışık geçişli kenarlıklar (`border: 1px solid rgba(..., 0.08)`) kullanılır.

4. **📜 Kod Bloğu / Terminal Taklidinden Kaçınma:**
   - Bilgi ve manifesto sunumunda IDE/terminal penceresi, fake kod (`const community = {}`), sözde terminal butonları kullanılmaz. Bunun yerine yüksek okunabilirlikli, editoryal kartlar ve tipografik hiyerarşi tercih edilir.

5. **🕹️ Pixel Art Temasının Kaldırılması:**
   - 8-bit kalın basamaklı kenarlıklar, piksel fontlar ve retro arcade elemanları kullanımdan kaldırılmıştır. Hem aydınlık hem karanlık mod aynı modern glassmorphism prensipleriyle çalışır.

---

## 2. Renk Paleti (Color Tokens)

### 2.1. Aydınlık Mod (Light Mode — Warm Cream & Linen)
| Token Adı | HEX / RGBA Kodu | Açıklama / Kullanım Alanı |
|---|---|---|
| `--bg-base` | `#FBF9F5` | Ana sayfa zemin rengi (Sıcak krem / eggshell) |
| `--bg-surface` | `rgba(253, 251, 247, 0.85)` | Kart ve bileşen yüzeyi (Hafif krem cam) |
| `--bg-elevated` | `#F3EFE7` | Vurgulu bloklar, hover yüzeyleri |
| `--border-subtle` | `rgba(40, 32, 24, 0.08)` | Zarif ayırıcı çizgiler ve kart kenarlıkları |
| `--border-strong` | `rgba(40, 32, 24, 0.16)` | Aktif eleman ve odak kenarlıkları |
| `--text-primary` | `#1A1D23` | Başlıklar, güçlü metinler (Derin antrasit) |
| `--text-secondary` | `#5A6270` | Gövde metinleri, açıklamalar |
| `--text-muted` | `#8892A2` | Meta bilgiler, pasif etiketler |

### 2.2. Karanlık Mod (Dark Mode — Deep Obsidian & Warm Slate)
| Token Adı | HEX / RGBA Kodu | Açıklama / Kullanım Alanı |
|---|---|---|
| `--bg-base` | `#0B0D12` | Ana sayfa zemin rengi (Derin arduvaz / füme obsidyen) |
| `--bg-surface` | `rgba(17, 20, 27, 0.78)` | Kart ve bileşen yüzeyi (Füme cam) |
| `--bg-elevated` | `#161B24` | Vurgulu bloklar, hover yüzeyleri |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)`| Zarif ayırıcı çizgiler ve cam kenarlıkları |
| `--border-strong` | `rgba(255, 255, 255, 0.15)`| Aktif eleman ve odak kenarlıkları |
| `--text-primary` | `#F4F2EE` | Başlıklar, güçlü metinler (Sıcak krem / kırık fildişi) |
| `--text-secondary` | `#9BA4B5` | Gövde metinleri, açıklamalar |
| `--text-muted` | `#646E82` | Meta bilgiler, pasif etiketler |

### 2.3. Premium Vurgu & Aksiyon Renkleri (Both Modes)
| Token Adı | HEX Kodu | Açıklama |
|---|---|---|
| `--accent-primary` | `#E35D14` | Ana Marka Vurgusu (Sunset Terracotta / Sıcak Amber) |
| `--accent-hover` | `#CC4F0D` | Buton hover durumu |
| `--accent-glow` | `rgba(227, 93, 20, 0.22)` | Zarif yayılım gölgesi (Asla kör edici neon değil) |
| `--accent-gold` | `#D4AF37` | Gold Sponsor ve özel vitrin vurgusu (Şampanya altını) |
| `--accent-gold-bg` | `rgba(212, 175, 55, 0.12)`| Gold kart zemin ışıltısı |
| `--accent-silver` | `#9AA5B1` | Silver Sponsor vurgusu (Platin arduvaz) |
| `--accent-bronze` | `#B87333` | Bronze Sponsor vurgusu (Antik bakır) |
| `--status-success` | `#267A56` | Başarı / Onay durumu (Çiğ yeşil yerine orman adaçayı) |
| `--status-info` | `#3B82F6` | Bilgi / İkincil odak (Yumuşak kobalt mavisi) |

---

## 3. Tipografi Sistemi

Modern, geometrik ve editoryal ağırlıklı sans-serif aileleri kullanılır.

- **Ana Yazı Tipi Ailesi:** `'Plus Jakarta Sans', 'Outfit', -apple-system, sans-serif`
- **Başlık Ağırlıkları:** 
  - `h1`: 700 / 800 (Bold / ExtraBold), `letter-spacing: -0.03em`
  - `h2`: 600 / 700 (SemiBold / Bold), `letter-spacing: -0.025em`
  - `h3`: 600 (SemiBold), `letter-spacing: -0.015em`
- **Gövde Metinleri (Body):**
  - 400 (Regular) ve 500 (Medium), `line-height: 1.65`
- **Monospace Kullanımı:**
  - Salt kod parçası veya teknik meta veri gerekmedikçe ana UI bileşenlerinde monospace font KULLANILMAZ.

---

## 4. Bileşen Tasarım Standartları

### 4.1. Butonlar (Buttons)
1. **Primary Button (Asil Terracotta):**
   - Zemin: `var(--accent-primary)`
   - Metin: Kırık fildişi (`#FFFDFC`), 600 ağırlık
   - Gölge: `0 4px 16px var(--accent-glow)`
   - Hover: `transform: translateY(-2px)`, derinleşen sıcak gölge
2. **Glass / Outline Button:**
   - Zemin: `rgba(255, 255, 255, 0.04)` (dark) / `rgba(0, 0, 0, 0.02)` (light)
   - Kenarlık: `1px solid var(--border-strong)`
   - Hover: Hafif yüzey dolgusu ve zarif renk geçişi

### 4.2. Manifesto & Biz Kimiz Bileşeni
- Kod penceresi (dot-red/green butonları, dosya adları, kod satırları) tamamen çıkarılmıştır.
- **Tasarım Biçimi:**
  - İki kolonlu şık editoryal yerleşim:
    - **Sol Alan:** Derinliği olan cam kart içerisinde topluluğun manifestosu, misyonu ve Uşak'ın yerel teknoloji vizyonu:
      > *"Uşak'ta yazılım, mühendislik ve bilişim ekosistemini büyütüyoruz. Büyük şehirlerdeki teknoloji enerjisini yerel dayanışmayla kendi şehrimize taşıyoruz."*
    - **Sağ Alan:** 4 temel değer rozeti (Sıfır Hiyerarşi, Tamamen Ücretsiz, Açık Kaynak Ruhu, Fiziksel Masa & Coworking) ve istatistik/eylem vitrini.

### 4.3. Sponsorlar Sistemi ve Tier Hiyerarşisi (CMS Entegrasyonu)
Payload CMS (`localhostusak-cms/src/collections/Sponsors.ts`) mimarisindeki tier yapısı frontend'e tam yansıtılır:

1. 🥇 **Altın Sponsor (Gold - `gold`):**
   - En prestijli vitrin (`width: 215px`, `min-height: 200px`).
   - Zarif şampanya altını ışıltılı kenarlık (`#D4AF37`), hafif altın aura (`box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2)`), üstte ferah logo alanı, altta sponsor ismi ve altın rozet.
2. 🥈 **Gümüş Sponsor (Silver - `silver`):**
   - Dengeli vitrin (`width: 210px`, `min-height: 198px`), platin/gümüş metalik kenarlık dokusu (`#9AA5B1`) ve gümüş ışıltı.
3. 🥉 **Bronz Sponsor (Bronze - `bronze`):**
   - Kompakt vitrin (`width: 205px`, `min-height: 195px`), sıcak bakır/amber tonlarında kenarlık (`#B87333`) ve ışıltı.
4. 🤝 **Topluluk Destekçisi (Community - `community`):**
   - Minimal zarif vitrin (`width: 200px`, `min-height: 192px`), sade ve şık cam dokusu.

**Vurucu Kart Formu ve Kenar Yumuşatma (Fade) Kuralları:**
- **Minimal & Uyumlu Boyut Farkı:** Tierlar arasındaki boyut farkı gözü yormayacak şekilde son derece minimaldir (yalnızca 3-5px delta). Hiyerarşi boyutla değil; kenarlık kalitesi, ışıltı, rozet ve zemin efektleriyle sağlanır.
- **Kenar Fade Geçişi:** Kayan şeritlerde kartların çıktığı ve kaybolduğu sol ve sağ sınırlarda keskin kesilmeler kesinlikle yasaktır. Hem CSS `mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent)` hem de `::before` / `::after` explicit gradient overlayleri kullanılarak hem aydınlık hem karanlık temada pürüzsüz yumuşak geçiş sağlanır.
- **Dikey/Kare Hiyerarşik Kart:** Kartlar yatay basık şeritler yerine; üstte büyük logo kutusu, altta ortalanmış sponsor adı ve bağlantı/rozet barındıran dikey/kare oranında tasarlanır.

**Sayfa Dağılımı:**
- **Ana Sayfa:** Sürekli kayan akıcı şerit (Marquee Ticker, hover ile duraklama) ve "Tüm Sponsorlarımız & Sponsorluk Paketleri" butonu.
- **Özel Sayfa (`/sponsorlar`):** Tier seviyelerine göre ayrılmış temiz ve ferah **Izgara (Grid)** yerleşimi (Gold, Silver, Bronze, Community blokları); sayfa altında doğrudan WhatsApp & E-posta sponsorluk CTA kutusu.

---

## 5. Arka Plan & Atmosfer Kuralları

- **Mevcut Arka Plan Animasyonu Korunur:** Ana sayfadaki mevcut partikül/ağ/konstelasyon animasyonu estetik olarak başarılıdır, çalışma prensibi bozulmaz.
- **Işık ve Ambiyans:** Animasyon üzerine eklenen gradient maskeler krem ve arduvaz zeminlere yumuşak şekilde yedirilir (`mask-image: radial-gradient(...)`).
