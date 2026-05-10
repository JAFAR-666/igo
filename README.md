# igo
<<<<<<< HEAD
igo is an on-demand labor marketplace platform that connects customers with nearby verified skilled workers in real time, helping daily wage workers find jobs faster while reducing dependency on middlemen.
=======

`igo` is a scalable MVP for an India-first on-demand labor marketplace. It includes:

- One mobile app with switchable `Customer` and `Worker` modes
- Node.js + Express API with PostgreSQL and Socket.IO
- React admin dashboard
- Firebase-ready OTP and push notification architecture
- Booking, worker discovery, KYC review, wage range control, reviews, wallets, and live tracking foundations

## Monorepo Structure

```text
apps/
  api/      Express API, PostgreSQL schema, Socket.IO
  admin/    React + Vite admin dashboard
  mobile/   Expo React Native app
docs/
  architecture.md
```

## MVP Scope

The current implementation focuses on a production-structured MVP:

- shared user account with both customer and worker capability
- OTP-ready authentication flow with demo OTP fallback for development
- customer home, worker discovery, worker profile, booking, tracking, payments, reviews
- worker onboarding, KYC upload metadata, availability, incoming jobs, earnings
- admin analytics, worker verification, booking visibility, complaints, wage range management
- normalized PostgreSQL schema with indexes and modular services

## Tech Stack

- Mobile: Expo React Native + TypeScript
- Admin: React + Vite + TypeScript
- API: Node.js + Express + TypeScript
- Database: PostgreSQL
- Realtime: Socket.IO
- Auth: Firebase OTP ready with JWT session layer
- Notifications: Firebase Cloud Messaging ready
- Storage: Cloudinary ready

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill:

- `DATABASE_URL`
- `JWT_SECRET`
- Firebase keys
- Cloudinary keys
- Google Maps key

### 3. Start PostgreSQL

Create a database named `igo` locally, or use Supabase / Railway / Render Postgres.

### 4. Run the API

```bash
npm run dev:api
```

### 5. Run the admin dashboard

```bash
npm run dev:admin
```

### 6. Run the mobile app

```bash
npm run dev:mobile
```

Use Expo Go on Android or an emulator.

## Deployment

### Backend

- Render / Railway ready
- set start command to `npm run start --workspace @igo/api`
- attach PostgreSQL and environment variables

### Admin

- deploy `apps/admin/dist` to Vercel, Netlify, or Render static hosting

### Mobile

- use Expo EAS for Android builds

## Product Notes

- Same mobile number can be both worker and customer
- Admin never accesses OTP secrets or raw payment details
- Architecture is designed for low-end Android optimization with lightweight screens, minimal animation, and reusable API contracts

## Documentation

- [Architecture](./docs/architecture.md)
- [API environment and deployment](./apps/api/README.md)
- [Admin dashboard notes](./apps/admin/README.md)
- [Mobile app notes](./apps/mobile/README.md)
>>>>>>> origin/codex-igo-mvp
