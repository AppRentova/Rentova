# Rentova MVP

Original, mobile-first peer-to-peer car sharing starter for Turkey. The interface is English-first and all source names are English; user-facing copy is routed through `lib/i18n.ts` so Turkish can be enabled without renaming code.

## Run locally

```bash
npm install
copy .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Architecture

- Next.js 15 App Router and React 19
- Strict TypeScript and Tailwind CSS
- Prisma/PostgreSQL schema for renters, owners, bookings, payments, inspections, claims and operations
- Zod validation and versioned route handlers under `/api/v1`
- Server Components by default; no client JavaScript is shipped for static marketing, search results or dashboards
- `next/image` responsive delivery for local vehicle media
- Maps are intentionally absent from the initial bundle and should be dynamically imported only when opened

## Mock integrations

Payment and KYC routes return mock states. Replace them behind provider service adapters with Iyzipay/PayTR and the chosen KYC provider. Keep payment authorization, capture, refund and signed webhook handling server-side. Never persist card data. Production booking creation must perform the overlap check inside a database transaction.

## Localization

`lib/i18n.ts` contains `en` and a prepared `tr` dictionary. Add locale routing or a persisted account preference when language switching becomes product scope. Currency and date output must use `Intl` formatters rather than hard-coded separators.

## Performance policy

- Keep pages server-rendered unless interaction requires a Client Component.
- Lazy-load maps, calendars and upload tools.
- Do not preload below-fold imagery.
- Keep analytics and support widgets behind consent and idle loading.
- Measure mobile LCP, INP and CLS before adding third-party SDKs.
