# Kariyer / CV Havuzu — KVKK Notları ve `/kvkk` Önerileri (7 Ekim 2026)

> **TASLAK — hukuki inceleme gerekir.** Teknik gereksinim listesidir, hukuki tavsiye değildir. Hukuki onay olmadan `applicationForm.enabled` açılmaz.
> Mevcut `/kvkk` sayfası (`localhostusak-web/src/pages/KvkkPage.tsx`, `KvkkSettings`) **değiştirilmedi**; aşağıdakiler öneridir.

## 1. CV metinlerinde değişenler
Yer: `localhostusak-cms/src/globals/CareersPageSettings.ts` → `applicationForm.privacyNotice` ve `consentText` (CMS'ten düzenlenebilir; admin panelinde "Hukuki inceleme gerekir" notu duruyor). Varsayılanlar migration'a (`20261005_163346_kariyer_cv_havuzu.{ts,json}`) da aynen işlendi.

| Konu | Metinde nerede |
|---|---|
| Veri sorumlusu | Aydınlatma, 1. paragraf |
| İşleme amacı | Aydınlatma "Amaç" + rıza metni |
| Aktarım: Uşak'taki sponsor/uygun firmalar (alıcı grubu, amaç, hangi veriler, hangi veriler gitmez, firmalar ayrı veri sorumlusu) | Aydınlatma "Verilerin aktarılması" (YENİ) + rıza metni (aktarım rızası eklendi) |
| Yurt dışı | Aydınlatma "Yurt dışına aktarım" (YENİ): Türkiye'deki sunucu, yurt dışına aktarım yok |
| Saklama | Aydınlatma "Saklama süresi": en fazla `{{retentionYears}}` (2) yıl, elle silme |
| 18 yaş, başkası adına başvuru yok | Rıza metni (mevcut) + aydınlatma "Yaş ve başvuru sahibi" (YENİ) |
| KVKK hakları, başvuru kanalı | Aydınlatma "Haklarınız" (genişletildi; kanal: `/kvkk`'deki iletişim adresi; 30 gün) |

Mevcut metinden **değiştirilen** tek paragraf: "Kimler görebilir". Eski hâli "Şirketlere … iletilmez" diyordu; firmalara aktarım kararıyla çeliştiği için yeniden yazıldı (metinler henüz commit'li/canlı değildi). `consentVersion` `cv-v1` bırakıldı (hiçbir başvuru alınmadı); canlıda başvuru alındıktan sonra metin değişirse `cv-v2` yapılmalı.

**Yer tutucular:** yalnızca `{{retentionYears}}` (aydınlatma ve rıza metninde birer kez). Web formu çözer; çözülemezse form gösterilmez. Başka `{{...}}` yok.

### Hukuki incelemede özellikle sorulacaklar
1. Firmalara aktarım için aydınlatmada **alıcı grubu** yeterli mi, yoksa firma adları listelenmeli mi? (Metin kategori veriyor; firma adı yok.)
2. Aktarım rızası, havuzda tutma rızasıyla **aynı kutuda**. Kurul "ayrı ve belirli konuya ilişkin" rıza ister; riskliyse ikinci (isteğe bağlı) onay kutusu gerekir — bu kod değişikliğidir (form + `apply.ts` + koleksiyon alanı + migration), ayrı iş.
3. Firmalar ayrı veri sorumlusu olacağı için topluluk–firma arasında bir protokol/taahhüt gerekir mi?
4. 2 yıllık süre ve "elle silme"nin yeterliliği (§6 araştırma: Kurul'un 30 gün / periyodik imha değerlendirmeleri).

## 2. Mevcut `/kvkk` ile çelişkiler (düzeltilmedi, yalnızca liste)
| # | Mevcut `/kvkk` | CV metni | Not |
|---|---|---|---|
| 1 | §5 "Yurtdışına Aktarım": "…**sunucu altyapılarının** veri merkezleri ve sunucuları yurt dışında yer alabilmektedir." | "Sunucu Türkiye'de, yurt dışına aktarım yok." | Sunucu Keyubu VDS (Türkiye). Çelişki "sunucu altyapıları" ifadesinde. WhatsApp/Meta ve GitHub kısmı CV ile ilgisiz, doğru kalır. |
| 2 | §4 "Verilerin Aktarımı": "Etkinlik mekânları", "teknik altyapı sağlayıcıları", "yasal zorunluluk" — **firmalara/sponsorlara aktarım yok** | CV'ler Uşak'taki sponsor/uygun firmalara aktarılır | Alıcı grubu eksik. |
| 3 | §8 Saklama: "amacın gerektirdiği süre … amaç ortadan kalkınca silinir" (süre yok) | CV: rıza tarihinden en fazla 2 yıl, elle silme | Genel metinle çelişmez ama CV süresi yazılı değil. |
| 4 | §2 İşlenen veriler: CV dosyası ve IP özeti kategorisi yok; "IP adresi" web ziyareti bağlamında geçiyor | CV dosyası + ham olmayan IP özeti | Eksik kategori. |
| 5 | §2 / §6: rıza "etkinlik, fotoğraf" odaklı | CV'ye özel ayrı rıza | Birleştirilmemeli; çelişki değil, kapsam notu. |

## 3. `/kvkk` için öneriler (mevcut metni değiştirmeden eklenecekler)
1. **§2 işlenen veriler — yeni madde:** *"CV Havuzu Başvuru Verileri:* ad soyad, e-posta, isteğe bağlı telefon, LinkedIn/GitHub bağlantıları, deneyim seviyesi, ilgi alanları, yüklenen CV dosyası ve içeriği, açık rıza tarihi/sürümü; kötüye kullanımı önlemek için IP adresinin geri döndürülemez özeti (ham IP saklanmaz)."
2. **§4 aktarım — yeni madde:** *"CV Havuzu Başvuruları: Açık rızanız doğrultusunda, yetkinlikleriniz Uşak'taki sponsor ve iş birliği yapılan uygun firmalarla eşleştirilerek bu firmalara iş, staj, freelance veya mentorluk fırsatı iletmek amacıyla aktarılabilir."*
3. **§5 yurt dışı — netleştirme önerisi** (mevcut cümleyi silmeden): *"CV Havuzu verileri Türkiye'de bulunan sunucuda saklanır ve yurt dışına aktarılmaz."* Ayrıca "sunucu altyapılarının … yurt dışında yer alabilmektedir" ifadesinin gerçek sunucu konumuyla uyumu gözden geçirilmeli (hukuki karar).
4. **§8 saklama — yeni cümle:** *"CV Havuzu başvuruları rıza tarihinden itibaren en fazla 2 yıl saklanır; süre dolduğunda yönetim ekibi tarafından silinir. Rızanızı geri alırsanız süre beklenmeden silinir."* (Değer CMS'teki `retentionYears` ile aynı kaynaktan okunmalı: plan Aşama 8 — `fetchCareersPageSettings()`.)
5. **Silme / yedek:** yedeklerdeki silinen kayıt kalıntısı süresi (admin kontrol listesi §2.6 eski dump 7 gün) metinde dürüstçe belirtilebilir.

Bu öneriler `KvkkPage.tsx`'e **uygulanmadı** (istek: mevcut metni değiştirme).
