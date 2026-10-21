# Sponsor logo boyutu — sonraki iş notu

Tarih: 8 Ekim 2026

## Durum

- Canlı API ölçümü (8 Ekim 2026): 1 aktif sponsor (ALDEMİR SOFTWARE, gold).
- Logo: `AldemirSofrwareLogo-3.png`, 1.121.090 B (~1,07 MB), 1440×1440 px.
- Sayfada en fazla 340×190 px gösteriliyor. Gereksiz büyük dosya, "logolar sonradan yükleniyor" şikâyetinin ana nedeni.

## Geçici çözüm (şimdi)

Logo admin panelinden elle küçültülüp yeniden yüklenir (rehber: PR açıklaması / sohbet notu).
Hedef: ~400–600 px genişlik, WebP veya PNG, 100 KB altı.

## Kalıcı çözüm (sonraki iş)

Sponsor sayısı arttıkça aynı sorun tekrarlayacağı için `localhostusak-cms/src/collections/Media.ts`
içindeki `upload: true` ayarına `imageSizes` eklenmeli (ör. 400 px genişlikli bir `logo` boyutu).
Frontend (`services/api.ts` → `fetchSponsors`) bu küçük sürümün URL'ini kullanmalı.

Yapılacaklar:
1. `Media` koleksiyonuna `imageSizes` ekle (+ Payload migration gerekir mi kontrol et).
2. Mevcut logoların küçük sürümlerini yeniden üret.
3. `fetchSponsors` içinde `doc.logo.sizes.<ad>.url` varsa onu kullan, yoksa orijinale düş.
4. Üretim veritabanında migration çalıştırmadan önce açıkça onay al.

Bu iş bu branch'in (sponsor-gecis-iyilestirme) kapsamında DEĞİL.
