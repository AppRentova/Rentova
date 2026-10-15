# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS, Radix/shadcn-style accessible primitives, Prisma with PostgreSQL, TanStack Query, React Hook Form with Zod, Zustand, Vitest and Playwright. This stack is explicitly required by the product brief.

## Users

- People in Turkish cities who need a nearby vehicle for a few hours or days.
- Individuals who want to earn income by sharing a vehicle they own.
- Small fleets, dealerships and rental operators that need lightweight inventory and booking operations.
- Rentova operations staff reviewing users, vehicles, payments, claims, risk and support.

## Product Purpose

Rentova makes short-term vehicle access and vehicle sharing practical in Turkey. Renters search by place and time, choose a verified vehicle, pay through a protected flow, document hand-off and return, and leave a review. Owners publish availability and pricing, manage requests and track earnings. Success means a renter can understand the service, find a suitable vehicle and begin a booking quickly on mobile, while owners and operations teams can safely manage the resulting lifecycle.

## Positioning

Rentova combines neighborhood-level hourly or daily access with a Turkey-ready trust workflow: identity and driving-license verification, payment authorization, protection choices, and photo-documented check-in/check-out in one product.

## Operating Context

Renters commonly search on mobile while planning a city errand, weekend trip or airport journey. They compare distance, total price, vehicle suitability and owner reputation. Owners maintain listings, documents, availability and hand-off rules. Operations staff work from dense desktop queues where status, risk and auditability matter.

## Capabilities and Constraints

- Public discovery, vehicle search, vehicle details, booking, owner and admin experiences are MVP scope.
- Booking covers protection choice, additional driver, payment authorization, confirmation, inspection, trip, return, damage report and review.
- Exact vehicle address remains hidden until booking approval.
- Payments and KYC use mock providers in the MVP behind replaceable service interfaces; no card data is stored.
- RBAC, idempotent payment webhooks, audit logs, upload validation and privacy-aware data retention are required architecture constraints.
- Turkish is the primary product language. Prices use TRY and Turkish formatting.
- Vehicle and operational data in the starter experience is illustrative until real providers and a production database are connected.

## Brand Commitments

- Name: Rentova.
- Contact: apprentova@gmail.com.
- Original product identity; no Getaround name, logo, copy, imagery or page replicas.
- The confirmed palette family is vivid violet, deep aubergine, acid lime, warm grey and white, informed by the current Getaround palette but applied in an original Rentova composition and hierarchy.
- Rectangular UI is a binding brand trait: cards, inputs, buttons, menus and panels use at most `5px` corner radius. Fully circular geometry is reserved for inherently circular controls such as map markers, avatars and status dots.
- The experience should feel clean, premium and warm, using a highly legible sans-serif with full Turkish character support.

## Evidence on Hand

The repository includes a detailed product brief, page and flow inventory, technical architecture, data model, API contract, security/KVKK notes, design-system notes and backlog under `getaround-tr-clone-brief/docs`. No verified testimonials, production usage metrics, partner logos, insurance guarantees or customer photography are supplied; future work must not fabricate them.

## Product Principles

1. Make trust visible through concrete states and documented actions, not unsupported claims.
2. Show the total commitment before the renter confirms.
3. Keep the renter path fast while preserving owner control and operational auditability.
4. Design mobile-first for renters and information-dense, accessible workflows for operators.
5. Treat provider integrations as replaceable boundaries, never as assumptions embedded in product UI.
6. Protect mobile users from unnecessary cost: ship server-rendered content first, minimize client JavaScript, defer maps and below-fold media, size responsive images correctly, and avoid continuous background work.

## Accessibility & Inclusion

Use semantic, keyboard-operable controls with visible focus, sufficient contrast and responsive layouts. Do not rely on color alone for status. Turkish characters and localized date, number and currency formats must render correctly.

## Open Decisions

- Production payment, KYC, maps, storage and insurance partners remain unselected.
- Production deployment target and formal accessibility conformance level are not specified.
- The audience priorities above are inferred directly from the supplied brief and should be revisited when production research is available.
