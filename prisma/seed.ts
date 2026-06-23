import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { email: "arsen@rentova.com" },
    update: {},
    create: {
      name: "Arsen B.",
      email: "arsen@rentova.com",
      phone: "+905368288181",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "eric@example.com" },
    update: {},
    create: {
      name: "Eric G.",
      email: "eric@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "meltem@example.com" },
    update: {},
    create: {
      name: "Meltem Y.",
      email: "meltem@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const car1 = await prisma.car.upsert({
    where: { id: "c1" },
    update: {},
    create: {
      id: "c1",
      ownerId: user2.id,
      brand: "Renault",
      model: "Twingo",
      year: 2012,
      transmission: "MANUAL",
      fuelType: "GASOLINE",
      seats: 4,
      pricePerHour: 5,
      pricePerDay: 36,
      deposit: 100,
      description: "Küçük ve ekonomik şehir içi araç. Park etmesi kolay, az yakıt tüketir.",
      lat: 38.4192,
      lng: 27.1287,
      address: "Alsancak, Cumhuriyet Bulvarı 45, İzmir",
      city: "İzmir",
      isActive: true,
    },
  });

  const car2 = await prisma.car.upsert({
    where: { id: "c2" },
    update: {},
    create: {
      id: "c2",
      ownerId: user3.id,
      brand: "Citroen",
      model: "C3",
      year: 2016,
      transmission: "MANUAL",
      fuelType: "DIESEL",
      seats: 5,
      pricePerHour: 6,
      pricePerDay: 33,
      deposit: 150,
      description: "Konforlu ve güvenilir aile aracı. Uzun yol için ideal.",
      lat: 38.4321,
      lng: 27.1423,
      address: "Konak, Kahramanlar, 35230 İzmir",
      city: "İzmir",
      isActive: true,
    },
  });

  const car3 = await prisma.car.upsert({
    where: { id: "c3" },
    update: {},
    create: {
      id: "c3",
      ownerId: user1.id,
      brand: "Skoda",
      model: "Fabia",
      year: 2017,
      transmission: "MANUAL",
      fuelType: "GASOLINE",
      seats: 5,
      pricePerHour: 7,
      pricePerDay: 55,
      deposit: 200,
      description: "Temiz, bakımlı ve az yıpranmış araç. Bluetooth, klima ve park sensörü mevcut.",
      lat: 38.4588,
      lng: 27.1654,
      address: "Karşıyaka, Atatürk Cad. 78, İzmir",
      city: "İzmir",
      isActive: true,
    },
  });

  const car4 = await prisma.car.upsert({
    where: { id: "c4" },
    update: {},
    create: {
      id: "c4",
      ownerId: user2.id,
      brand: "Citroen",
      model: "C1",
      year: 2011,
      transmission: "MANUAL",
      fuelType: "GASOLINE",
      seats: 4,
      pricePerHour: 4,
      pricePerDay: 28,
      deposit: 80,
      description: "Ekonomik ve pratik şehir arabası. Düşük yakıt tüketimi.",
      lat: 38.3892,
      lng: 27.0892,
      address: "Balçova, İnciraltı Cad. 23, İzmir",
      city: "İzmir",
      isActive: true,
    },
  });

  const existingImages = await prisma.carImage.findMany({ where: { carId: car1.id } });
  if (existingImages.length === 0) {
    await prisma.carImage.createMany({
      data: [
        { carId: car1.id, url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80", isPrimary: true },
        { carId: car2.id, url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", isPrimary: true },
        { carId: car3.id, url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80", isPrimary: true },
        { carId: car4.id, url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", isPrimary: true },
      ],
    });
  }

  console.log("✅ Seed completed!");
  console.log(`   Users: ${user1.name}, ${user2.name}, ${user3.name}`);
  console.log(`   Cars: 4 adet`);
  console.log(`   Login: arsen@rentova.com / password123`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
