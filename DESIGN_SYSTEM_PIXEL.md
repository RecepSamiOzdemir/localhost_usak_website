# localhostusak — Pixel Art Tasarım Dili (Cozy Retro / 8-Bit Coffee & Code)

> **Tasarım Konsepti:** 90'lar arcade ve 16-bit retro indie hacker estetiğini, sıcacık bir kafe ve samimi bir topluluk masası metaforuyla birleştiren; sıcak krem tonları, pikselli kenarlıklar ve samimi illüstrasyonlarla örülü nostaljik tasarım dili.

---

## 1. Tasarım Felsefesi ve Kimlik

Pixel Art tasarım dili, **"Samimi, Ulaşılabilir, Eğlenceli ve Birlikte Üreten Topluluk"** hissini merkeze alır. Teknolojinin soğuk ve karmaşık yüzünü kırar; yazılıma yeni başlayan bir öğrenciden kıdemli bir mühendise kadar herkesin kendini rahat hissedeceği bir buluşma davetidir.

- **Anahtar Sloganlar:**
  - *"Kahveni al, laptopunu getir, aramıza katıl."*
  - *"Merakın varsa, masada sana da yer var."*
  - *"Resmiyetten uzak, samimi bir buluşma."*
  - *"CONNECT • CODE • CREATE • COMMUNITY"*
- **Karakteristik Detaylar:**
  - Basamaklı pikselli çerçeveler (Stepped Pixel Borders) ve 90 derece köşe çentikleri
  - 8-bit / 16-bit piksel ikon seti (buharı tüten kahve kupası, piksel kalp, pikselli laptop, çalar saat)
  - Sıcak parşömen/krem rengi zemin üzerine keskin siyah piksel çizgileri
  - Pikselli konuşma balonları (speech bubbles) ve piksel insan figürleri (avatar dizilimi)
  - Uşak Saat Kulesi ve Cilandiras Köprüsü'nün piksel sanatıyla yeniden yorumlanmış manzarası

---

## 2. Renk Paleti (Color Tokens)

Sıcak, organik, kafe ve nostalji hissi veren toprak ve narenciye tonları temel alınır.

### 2.1. Temel Renkler
| Token Adı | HEX Kodu | Açıklama |
|---|---|---|
| `--bg-cream` | `#FFF7EC` | Sayfa ana arka planı (sıcak krem/parşömen) |
| `--bg-card` | `#FFFFFF` | Kart ve kutu arka planları (net kontrast) |
| `--bg-subtle` | `#F5EBDC` | İkincil bloklar, masa zeminleri |
| `--pixel-black`| `#1E1B18` | Tüm piksel konturları, çerçeveler ve birincil metin |

### 2.2. Vurgu ve Karakter Renkleri
| Token Adı | HEX Kodu | Açıklama |
|---|---|---|
| `--pixel-orange` | `#EE6C19` | Ana marka turuncusu (Piksel başlıklar, butonlar, kalp) |
| `--pixel-orange-light` | `#FFA559` | İkincil turuncu (Hover ve aktif seçim dolgusu) |
| `--coffee-brown` | `#5C3D2E` | Ahşap masa, kahve ve kafe vurguları |
| `--pixel-yellow` | `#FFC043` | JS sticker sarısı, yıldızlar, dikkat çekici etiketler |
| `--pixel-green` | `#4F772D` | Bitkiler, başarı durumları, doğa vurgusu |
| `--pixel-blue` | `#3A86FF` | TS sticker mavisi, web bağlantıları |

---

## 3. Tipografi Sistemi

Retro bir atmosfer yaratırken aynı zamanda web sitesinin metinlerinin rahatça okunabilir kalması için ikili bir tipografi kurgulanır:

### 3.1. Font Aileleri
- **Piksel Başlık Fontu (Display / Titles):** `Pixelify Sans`, `Silkscreen` veya `Press Start 2P`
  - Kullanım: Logo, H1-H2 ana başlıklar, buton metinleri, rozetler.
  - Stil: Tamamen büyük harf (UPPERCASE) ve belirgin piksel dokusu.
- **Gövde ve Açıklama Fontu (Body / Reading):** `Plus Jakarta Sans`, `Inter` veya `Nunito`
  - Piksel fontlar uzun paragraflarda gözü yorduğu için gövde metinlerinde temiz, yuvarlak veya neo-grotesk bir font kullanılır.
  - Ağırlıklar: `500 (Medium)`, `700 (Bold)`

### 3.2. Hiyerarşik Ölçek
```css
--font-pixel-hero: clamp(2rem, 4.5vw, 3.8rem); /* Örn: LOCALHOSTUSAK İLK BULUŞMA */
--font-pixel-sub: clamp(1.4rem, 2.5vw, 2.2rem);  /* Örn: KİMLER KATILABİLİR? */
--font-body: 1.05rem;                           /* Açıklamalar ve kart metinleri */
--font-badge: 0.85rem;                          /* CONNECT • CODE • CREATE */
```

---

## 4. UI Bileşenleri ve Piksel Tasarım Öğeleri

Referans afişlerdeki (`01`, `02`, `03`, `04`, `3962829439369017444`) görsel bileşenlerin web koduna uyarlanması:

### 4.1. Piksel Çerçeveler (Stepped Pixel Borders)
Pikselli görünüm için modern CSS `clip-path` veya klasik retro `box-shadow` tekniği kullanılır:

```css
/* Retro 8-bit Basamaklı Kutu */
.pixel-box {
  background: var(--bg-card);
  border: 3px solid var(--pixel-black);
  box-shadow: 4px 4px 0px var(--pixel-black);
  position: relative;
}

/* Piksel Çentikli Köşe (Corner Cutout / Inset) */
.pixel-corner-box {
  border: 4px solid var(--pixel-black);
  box-shadow: 
    -4px 0 0 0 var(--pixel-black),
    4px 0 0 0 var(--pixel-black),
    0 -4px 0 0 var(--pixel-black),
    0 4px 0 0 var(--pixel-black);
}
```

### 4.2. Piksel Butonlar (Retro Clickable Buttons)
- **Normal Durum:** 3px siyah çerçeve, parlak turuncu dolgu, `4px 4px 0px #1E1B18` sert gölge.
- **Hover:** Hafif sarıya çalan parlak turuncu.
- **Active (Tıklanma):** `transform: translate(3px, 3px); box-shadow: 1px 1px 0px #1E1B18;` (arcade buton basılma hissi).

### 4.3. Konuşma Balonları (Pixel Speech Bubbles)
- Sol tarafında piksel kalp (`🧡`) içeren, altında piksel kuyruğu olan retro diyalog pencereleri.
- Örnek kullanım: *"Teknolojiye ilgisi olan herkese açık."* veya *"Sohbet, kahve, çalışma ve networking."*

### 4.4. Bilgi Rozetleri & Şeritler (Pixel Ribbons)
- Üstte ve altta zikzaklı piksel desenleri (`▲▼▲▼▲▼▲`).
- Alt bantta yan yana duran pikselli insan avatarları (`🧍🧍🧍🧍🧍`).
- Instagram ve sosyal medya barı: `[ 📷 @localhostusak ] [ CONNECT • COFFEE • COMMUNITY ]`

### 4.5. İkon Kütüphanesi (8-Bit Pixel Set)
- ☕ Buharı tüten kahve kupası (Sohbet / Kafe)
- 💻 Ekranda `</>` olan retro laptop (Çalışma / Kodlama)
- 📅 8-bit takvim & saat (Tarih ve Saat)
- 📍 Piksel harita pini (Mekan / Uşak)
- 💡 Piksel ampul (İlham / Fikirler)
- 🎓 Piksel mezuniyet kepi (Öğrenme / Gelişim)
- 🧡 Piksel kalp (Topluluk sevgisi & samimiyet)

---

## 5. İllüstrasyon ve Sahne Anlatımı

- **Ana Kahraman Görseli (Hero Illustration):**
  - Ahşap bir kafe masasında laptoplarıyla çalışan, gülen, kahve içen samimi insanlar.
  - Masadaki laptoplarda `JS`, `TS`, `GitHub` pikselli çıkartmaları.
  - Duvardaki kara tahtada: `CODE • COFFEE • CONNECT`.
  - Pencereden dışarı bakıldığında Uşak Saat Kulesi ve Türk bayrağı silüeti.
- Bu sahne, web sitesinin ana sayfasında interaktif bir karşılama sahnesi olarak (tıklanabilir laptoplar, kahve kupaları) kurgulanabilir.

---

## 6. Örnek CSS Değişkenleri ve Temel Sınıflar

```css
:root {
  --bg-cream: #FFF7EC;
  --bg-card: #FFFFFF;
  --pixel-black: #1E1B18;
  --pixel-orange: #EE6C19;
  --pixel-orange-hover: #FF8330;
  --pixel-yellow: #FFC043;
  --coffee-brown: #5C3D2E;
  
  --font-pixel: 'Pixelify Sans', 'Silkscreen', cursive;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  
  --pixel-border-width: 3px;
  --pixel-shadow: 4px 4px 0px var(--pixel-black);
}

.pixel-btn-primary {
  font-family: var(--font-pixel);
  background-color: var(--pixel-orange);
  color: #FFFFFF;
  border: var(--pixel-border-width) solid var(--pixel-black);
  box-shadow: var(--pixel-shadow);
  padding: 12px 24px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.08s steps(2);
}

.pixel-btn-primary:hover {
  background-color: var(--pixel-orange-hover);
}

.pixel-btn-primary:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px var(--pixel-black);
}
```

---

## 7. Önerilen Kütüphaneler ve Web Araçları (`Web_Gelistirme_Araclari_Rehberi.md` Referansı)

Cozy Pixel Art / 8-Bit Kafe temasını hayata geçirirken rehberdeki şu spesifik araçlardan yararlanılır:

- ☕ **Dithered Swirl Backgrounds (`aliiman.in`):**
  - Sıcak krem arka plana 90'lar arcade / GameBoy hissi veren pikselli tram (dithering) ve hafif retro gradyan dokuları oluşturur.
- 🕹️ **Uiverse.io & Cult-UI (`cult-ui.com`):**
  - Arcade butonlarının basıldığında pikselli olarak aşağı çökme (tactile click) ve mekanik klavye buton tepkilerini sağlar.
- 👾 **Asciinator (`asciinator.app`):**
  - Uşak Saat Kulesi'ni, Cilandiras Köprüsü'nü ve topluluk sloganlarını retro ASCII karakter sanatına dönüştürür.
- ⚡ **Anime.js:**
  - Butonlara tıklandığında veya başarı durumlarında ekranda uçuşan 8-bit piksel parçacıkları (pixel confetti / sparkles) için kullanılır.
- 🎯 **ItsHover (`itshover.com`):**
  - Pikselleştirilmiş buharlı kahve kupası, nabız atan piksel kalp ve 8-bit avatar animasyonları.
