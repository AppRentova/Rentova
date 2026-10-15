# API Sozlesmesi

Base path: `/api/v1`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /me`

## Search

- `GET /vehicles/search?lat=&lng=&startsAt=&endsAt=&type=&minPrice=&maxPrice=`
- `GET /vehicles/:id`
- `GET /vehicles/:id/availability`

## Vehicle Owner

- `POST /owner/vehicles`
- `PATCH /owner/vehicles/:id`
- `POST /owner/vehicles/:id/photos`
- `PUT /owner/vehicles/:id/availability`
- `PUT /owner/vehicles/:id/pricing`
- `POST /owner/vehicles/:id/submit-review`
- `GET /owner/bookings`
- `POST /owner/bookings/:id/accept`
- `POST /owner/bookings/:id/reject`

## Booking

- `POST /bookings/quote`
- `POST /bookings`
- `GET /bookings/:id`
- `POST /bookings/:id/cancel`
- `POST /bookings/:id/check-in`
- `POST /bookings/:id/check-out`
- `POST /bookings/:id/review`

## Payments

- `POST /payments/methods`
- `POST /payments/authorize`
- `POST /payments/capture`
- `POST /payments/refund`
- `POST /webhooks/payment-provider`

## Verification

- `POST /verification/identity/start`
- `POST /verification/license/start`
- `GET /verification/status`
- `POST /webhooks/kyc-provider`

## Claims

- `POST /claims`
- `GET /claims/:id`
- `POST /claims/:id/messages`
- `PATCH /admin/claims/:id/status`

## Admin

- `GET /admin/users`
- `GET /admin/vehicles/review-queue`
- `POST /admin/vehicles/:id/approve`
- `POST /admin/vehicles/:id/reject`
- `GET /admin/bookings`
- `GET /admin/audit-logs`

## Ornek Quote Response

```json
{
  "vehicleId": "veh_123",
  "startsAt": "2026-11-01T09:00:00+03:00",
  "endsAt": "2026-11-01T18:00:00+03:00",
  "currency": "TRY",
  "subtotal": 1450,
  "serviceFee": 180,
  "protectionOptions": [
    { "id": "basic", "name": "Temel", "price": 0, "deductible": 15000 },
    { "id": "plus", "name": "Plus", "price": 250, "deductible": 7500 },
    { "id": "premium", "name": "Premium", "price": 450, "deductible": 3000 }
  ],
  "total": 1630
}
```

