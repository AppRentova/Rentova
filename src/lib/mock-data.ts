export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  address: string;
  pricePerDay: number;
  pricePerHour: number;
  seats: number;
  transmission: "Otomatik" | "Manuel";
  fuel: "Elektrik" | "Hibrit" | "Benzin" | "Dizel";
  rating: number;
  trips: number;
  image: string;
  host: string;
  distanceKm: number;
  lat: number;
  lng: number;
  tags: string[];
  description: string;
};

export const cars: Car[] = [
  {
    id: "1",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    city: "İstanbul",
    address: "Beşiktaş, İstanbul",
    pricePerDay: 2890,
    pricePerHour: 290,
    seats: 5,
    transmission: "Otomatik",
    fuel: "Elektrik",
    rating: 4.9,
    trips: 128,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
    host: "Mert Yıldız",
    distanceKm: 1.8,
    lat: 41.043,
    lng: 29.004,
    tags: ["Günlük", "Şehir", "Hızlı teslimat"],
    description:
      "Şehir içi kullanım için sessiz, temiz ve uzun menzilli bir elektrikli sedan.",
  },
  {
    id: "2",
    brand: "BMW",
    model: "320i",
    year: 2023,
    city: "İstanbul",
    address: "Kadıköy, İstanbul",
    pricePerDay: 2450,
    pricePerHour: 260,
    seats: 5,
    transmission: "Otomatik",
    fuel: "Benzin",
    rating: 4.8,
    trips: 94,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    host: "Derya Kalkan",
    distanceKm: 3.2,
    lat: 40.990,
    lng: 29.025,
    tags: ["Premium", "Aile", "Uzun yol"],
    description: "Konforlu sürüş, geniş bagaj ve premium iç mekan ile dengeli bir seçenek.",
  },
  {
    id: "3",
    brand: "Fiat",
    model: "Egea",
    year: 2022,
    city: "Ankara",
    address: "Çankaya, Ankara",
    pricePerDay: 1350,
    pricePerHour: 160,
    seats: 5,
    transmission: "Manuel",
    fuel: "Dizel",
    rating: 4.7,
    trips: 201,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
    host: "Serkan Aydın",
    distanceKm: 2.6,
    lat: 39.920,
    lng: 32.854,
    tags: ["Ekonomik", "Sık kiralanan", "Uygun fiyat"],
    description: "Bütçe dostu günlük kullanım için güvenilir ve pratik sedan.",
  },
  {
    id: "4",
    brand: "Renault",
    model: "Clio",
    year: 2024,
    city: "İzmir",
    address: "Bornova, İzmir",
    pricePerDay: 1190,
    pricePerHour: 140,
    seats: 5,
    transmission: "Otomatik",
    fuel: "Hibrit",
    rating: 4.8,
    trips: 86,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    host: "Ece Demir",
    distanceKm: 4.1,
    lat: 38.455,
    lng: 27.218,
    tags: ["Şehir", "Yeni model", "Hibrit"],
    description: "Dar sokaklarda rahat, yakıt tüketiminde ekonomik, günlük şehir kullanımına uygun.",
  },
];

export const notifications = [
  {
    title: "Rezervasyon onaylandı",
    meta: "Az önce",
    body: "Tesla Model 3 için yarın 09:00 teslimatınız hazır.",
  },
  {
    title: "Yeni mesaj",
    meta: "12 dk önce",
    body: "Araç sahibi teslim noktasını teyit etmek istiyor.",
  },
  {
    title: "Ödeme yöntemi uyarısı",
    meta: "1 saat önce",
    body: "Kartınızın son kullanma tarihi 30 gün içinde doluyor.",
  },
];

export const trips = [
  { title: "İstanbul -> Sapanca", status: "Aktif", dates: "30 Ağu - 2 Eyl" },
  { title: "Ankara hafta sonu", status: "Tamamlandı", dates: "18 Ağu - 20 Ağu" },
  { title: "İzmir şehir içi", status: "İptal", dates: "11 Ağu" },
];

export const messages = [
  {
    person: "Mert Yıldız",
    preview: "Aracı teslim alacağınız saat için park girişinde buluşalım.",
    time: "09:42",
  },
  {
    person: "Derya Kalkan",
    preview: "Fotoğrafları yükledim, isterseniz detayları kontrol edin.",
    time: "08:17",
  },
];

