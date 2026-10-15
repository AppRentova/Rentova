# Antigravity / GPT-6 Sol Ana Prompt

Asagidaki projeyi Next.js + React + TypeScript ile kur. Bu zip'teki tum dokumanlari baglam olarak oku ve hicbir kritik ozelligi atlama.

## Proje

Turkiye pazari icin Getaround benzeri, ancak marka/tasarim/metin olarak tamamen ozgun bir peer-to-peer arac paylasim ve kisa donem kiralama platformu gelistir.

Marka adi: Rentova
Iletisim e-postasi: apprentova@gmail.com

## Zorunlu Teknoloji

- Next.js 15 App Router
- React
- TypeScript strict
- Tailwind CSS
- shadcn/ui veya Radix tabanli erisilebilir component yapisi
- Prisma + PostgreSQL
- TanStack Query
- React Hook Form + Zod
- Zustand
- Jest/Vitest + Playwright

Not: Nuxt Vue tabanlidir. Kullanici React istedigi icin Nuxt yerine Next.js kullan. Eger Nuxt israr edilirse ayri Nuxt esdegeri hazirla.

## Uygulama Kapsami

Public:
- Ana sayfa: konum + teslim/iade tarihi/saat arama
- Arama sonuc: liste + harita + filtreler
- Arac detay
- Nasil calisir
- Guven/sigorta
- Aracini listele

Auth:
- Kayit/giris
- OTP yapisina hazir mimari
- Profil tamamlama
- KYC ve ehliyet status ekranlari

Kiralayan:
- Arac arama
- Fiyat teklifi
- Koruma paketi secimi
- Odeme/provizyon akisi
- Rezervasyon detay
- Check-in/check-out
- Yorum

Arac sahibi:
- Arac ekleme
- Fotograf yukleme
- Takvim ve fiyat
- Rezervasyon yonetimi
- Kazanc ozeti

Admin:
- Kullanici dogrulama
- Arac moderasyon
- Rezervasyon takibi
- Hasar/itiraz
- Audit log

## Guvenlik

- Role-based access control
- Rate limit
- Webhook imza dogrulama
- Idempotency key
- Dosya yukleme validation
- Admin MFA hazirligi
- Audit log
- KVKK uyumlu veri saklama ve silme akislari

## UI

Getaround'i bire bir kopyalama. Ozgun marka dili kullan:
- Primary teal `#0F766E`
- Accent amber `#F59E0B`
- Temiz, hizli, mobil once arayuz
- Ilk ekranda arama formu
- Desktop'ta harita + liste

## Ilk Cikti

1. Calisan Next.js projesi
2. Prisma schema
3. Seed data
4. Mock API endpointleri
5. Ana sayfa, arama, detay, rezervasyon, sahip paneli, admin paneli
6. Test setup
7. README kurulum talimatlari

Once repo iskeletini kur, sonra MVP ekranlarini tamamla, sonra guvenlik ve testleri ekle.
