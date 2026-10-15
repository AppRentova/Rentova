# UI Tasarim Sistemi

## Tasarim Ilkeleri

- Getaround'i kopyalama; kategori beklentilerini ozgun marka ile karsila.
- Ilk ekranda gercek is: konum + tarih/saat arama.
- Mobil once, desktop'ta harita + liste hibrit gorunum.
- Formlar kisa, durumlar net, fiyat kirilimi seffaf.
- Guven mesajlari abartisiz ama gorunur.

## Renk Paleti

- Primary: `#0F766E` teal
- Primary dark: `#115E59`
- Accent: `#F59E0B`
- Text: `#111827`
- Muted text: `#6B7280`
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Border: `#E5E7EB`
- Danger: `#DC2626`
- Success: `#16A34A`

## Tipografi

- Font: Inter veya Geist
- H1: 44/52 desktop, 32/40 mobile
- H2: 32/40 desktop, 26/34 mobile
- Body: 16/24
- Small: 14/20

## Component Listesi

- LocationSearchInput
- DateTimeRangePicker
- VehicleCard
- VehicleFilterDrawer
- MapPanel
- PriceBreakdown
- ProtectionPlanSelector
- OwnerProfileSummary
- ReviewList
- PhotoUploader
- DamageMarker
- AvailabilityCalendar
- BookingStepper
- VerificationStatusBadge
- AdminDataTable
- AuditLogTimeline

## Responsive Kurallar

- Mobile: tek kolon, filtre drawer, harita opsiyonel tam ekran
- Tablet: liste + sticky filtre
- Desktop: sol liste, sag harita veya tersi
- CTA butonlari mobilde sticky bottom bar olabilir

## Bos/Hata/Yukleniyor Durumlari

- Arama sonucu yok: tarih/konum genisletme onerisi
- Odeme basarisiz: tekrar dene + farkli kart
- KYC bekliyor: status ve tahmini sure
- Arac moderasyonda: sahibin gormesi icin pasif preview
- Rezervasyon cakismasi: yeni zaman secimi

