# Guvenlik, KVKK ve Operasyon Kontrol Listesi

## Hukuki ve Uyumluluk

- KVKK aydinlatma metni
- Acik riza metinleri
- Mesafeli satis/kiralama sozlesmesi
- Kullanici sozlesmesi
- Gizlilik politikasi
- Cerez politikasi
- Sigorta sartlari
- Arac sahibi sozlesmesi
- Iptal/iade politikasi
- Hasar ve itiraz proseduru
- Iletisim ve destek e-postasi: `apprentova@gmail.com`

## KYC ve Ehliyet

- Kimlik dogrulama
- Ehliyet dogrulama
- Yas siniri ve ehliyet yasi kurallari
- Odeme yontemi sahibi ile kullanici eslesmesi
- Yuksek riskli kullanicida manuel inceleme
- Belge goruntulerinin sifreli saklanmasi

## Odeme Guvenligi

- Kart verisi tutulmamali; tokenized provider kullanilmali
- 3D Secure destegi
- Provizyon ve capture ayrimi
- Chargeback operasyon sureci
- Webhook imza dogrulama
- Idempotency key zorunlulugu

## Uygulama Guvenligi

- MFA opsiyonel, admin icin zorunlu
- Rate limiting
- CSRF korumasi
- XSS sanitization
- SQL injection korumasi
- SSRF korumasi
- Dosya yukleme MIME ve boyut kontrolu
- Virus/malware tarama
- Secrets manager
- Row-level authorization kontrolleri
- Audit log
- Session rotation

## Fraud Sinyalleri

- Yeni hesap + pahali arac + son dakika rezervasyon
- Kimlik/ehliyet/odeme sahibi uyumsuzlugu
- Birden fazla basarisiz odeme
- Cihaz/IP tekrar paterni
- Ayni arac icin sik iptal
- Hasar gecmisi
- Kullanici sikayet skoru

## Arac ve Kiralama Guvenligi

- Check-in/check-out fotograf zorunlulugu
- Kilometre ve yakit seviyesi kaydi
- Arac hasar noktasi isaretleme
- Rezervasyon oncesi arac sahibine ve kiralayana kurallar
- Acil durum destek kanali
- Yol yardim partneri entegrasyonu

## Admin Operasyon

- Her manuel onay/reddetme audit log'a yazilmali
- Kritik verilerde maker-checker opsiyonu
- Destek ekibi icin sinirli PII gorunurlugu
- Veri silme ve anonimlestirme is akisi
