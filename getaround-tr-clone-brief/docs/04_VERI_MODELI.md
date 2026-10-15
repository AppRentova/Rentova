# Veri Modeli

## Ana Entity'ler

- User
- Profile
- Verification
- Vehicle
- VehiclePhoto
- VehicleAvailability
- VehiclePricing
- Booking
- BookingProtectionPlan
- Payment
- Inspection
- InspectionPhoto
- DamageReport
- Review
- Message
- SupportTicket
- AdminAuditLog
- PromoCode
- Referral

## Prisma Taslak

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  phone          String?  @unique
  passwordHash   String?
  role           UserRole @default(USER)
  status         UserStatus @default(PENDING)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  profile        Profile?
  vehicles       Vehicle[] @relation("OwnerVehicles")
  bookings       Booking[] @relation("DriverBookings")
}

model Profile {
  id          String @id @default(cuid())
  userId      String @unique
  firstName   String
  lastName    String
  birthDate   DateTime?
  avatarUrl   String?
  city        String?
  user        User @relation(fields: [userId], references: [id])
}

model Verification {
  id          String @id @default(cuid())
  userId      String
  type        VerificationType
  status      VerificationStatus @default(PENDING)
  provider    String?
  providerRef String?
  metadata    Json?
  createdAt   DateTime @default(now())
}

model Vehicle {
  id          String @id @default(cuid())
  ownerId     String
  plateHash   String
  brand       String
  model       String
  year        Int
  fuelType    FuelType
  transmission Transmission
  seats       Int
  city        String
  district    String
  lat         Float
  lng         Float
  status      VehicleStatus @default(DRAFT)
  owner       User @relation("OwnerVehicles", fields: [ownerId], references: [id])
  photos      VehiclePhoto[]
  bookings    Booking[]
}

model Booking {
  id            String @id @default(cuid())
  vehicleId     String
  driverId      String
  startsAt      DateTime
  endsAt        DateTime
  status        BookingStatus @default(PENDING_PAYMENT)
  priceSubtotal Int
  serviceFee    Int
  protectionFee Int
  totalAmount   Int
  currency      String @default("TRY")
  vehicle       Vehicle @relation(fields: [vehicleId], references: [id])
  driver        User @relation("DriverBookings", fields: [driverId], references: [id])
  payments      Payment[]
  inspections   Inspection[]
}

model Inspection {
  id        String @id @default(cuid())
  bookingId String
  type      InspectionType
  odometer  Int?
  fuelLevel Int?
  notes     String?
  createdAt DateTime @default(now())
  booking   Booking @relation(fields: [bookingId], references: [id])
  photos    InspectionPhoto[]
}

enum UserRole { USER OWNER ADMIN SUPPORT }
enum UserStatus { PENDING ACTIVE SUSPENDED DELETED }
enum VerificationType { IDENTITY DRIVER_LICENSE PAYMENT_OWNER }
enum VerificationStatus { PENDING APPROVED REJECTED EXPIRED }
enum FuelType { GASOLINE DIESEL HYBRID ELECTRIC LPG }
enum Transmission { MANUAL AUTOMATIC }
enum VehicleStatus { DRAFT REVIEW ACTIVE PAUSED REJECTED }
enum BookingStatus { PENDING_PAYMENT CONFIRMED ACTIVE COMPLETED CANCELLED DISPUTED }
enum InspectionType { CHECK_IN CHECK_OUT }
```

