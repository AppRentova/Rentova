# Turkiye P2P Arac Paylasim Platformu - Uygulama Kurulum Paketi

Bu paket, Getaround benzeri bir arac paylasim/kiralama platformunu Turkiye pazari icin gelistirmek uzere hazirlanmis kapsamli urun ve teknik brief'tir.

Onemli: Getaround markasi, metinleri, gorselleri, ikonlari ve bire bir arayuz kopyasi kullanilmamalidir. Bu paket, halka acik sayfalardan cikarilan urun desenlerini ozgun bir marka ve tasarim sistemiyle yeniden yorumlar.

## Hedef

Kullanicilarin yakindaki araclari saatlik veya gunluk kiralayabildigi, arac sahiplerinin araclarini listeleyip gelir elde edebildigi, kimlik/ehliyet dogrulama, sigorta, odeme, hasar kontrolu, yorumlar ve operasyon paneli olan hizli, responsive bir web uygulamasi.

Marka: Rentova
Iletisim e-postasi: apprentova@gmail.com

## Teknoloji Karari

Kullanici isteginde "React framework" ve "Nuxt component" birlikte geciyor. Nuxt Vue tabanlidir; React ile bire bir uyumlu degildir.

Onerilen yol:
- Frontend: React + Next.js 15 + TypeScript + Tailwind CSS
- UI: shadcn/ui mantiginda erisilebilir component sistemi
- Backend: NestJS veya Next.js Route Handlers ile baslanabilir
- DB: PostgreSQL + Prisma
- Cache/queue: Redis + BullMQ
- Storage: S3 uyumlu obje depolama
- Harita: Mapbox veya Google Maps
- Odeme: Iyzipay/PayTR/Stripe alternatifleri
- Kimlik: Onfido, Sumsub veya yerel KYC saglayici

Nuxt istenirse `docs/NUXT_ALTERNATIFI.md` dosyasindaki esdeger Vue/Nuxt planini kullanin.

## Paket Icerigi

- `docs/01_URUN_BRIEF.md`: Urun vizyonu, Getaround analizinden cikan ozellikler, Turkiye uyarlamasi
- `docs/02_SAYFA_VE_AKISLAR.md`: Tum ekranlar, kullanici akislari, edge case'ler
- `docs/03_TEKNIK_MIMARI.md`: Sistem mimarisi, servisler, entegrasyonlar
- `docs/04_VERI_MODELI.md`: Entity ve Prisma model taslagi
- `docs/05_API_SOZLESMESI.md`: REST/JSON API endpoint taslagi
- `docs/06_GUVENLIK_KVKK.md`: Guvenlik, KVKK, fraud, odeme, KYC ve operasyon kontrol listesi
- `docs/07_UI_TASARIM_SISTEMI.md`: Ozgun UI dili, responsive kurallar, component listesi
- `docs/08_BACKLOG.md`: MVP, v1 ve ileri faz backlog
- `docs/09_ANTIGRAVITY_PROMPT.md`: Antigravity icin dogrudan kullanilacak ana prompt
- `starter-app/`: Next.js baslangic iskeleti

## Hemen Baslatma

Antigravity/GPT-6 Sol'a once `docs/09_ANTIGRAVITY_PROMPT.md` dosyasini verin, sonra bu zip'in tamamini proje baglami olarak ekleyin.

Yerel baslangic icin:

```bash
cd starter-app
npm install
npm run dev
```
