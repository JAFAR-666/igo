# igo API

Express + PostgreSQL API for the `igo` marketplace.

## Core features

- JWT auth
- Firebase-ready OTP hooks
- role-based authorization
- bookings, reviews, payments, wallets
- admin analytics and KYC review
- Socket.IO events for booking and location updates

## Run

```bash
npm run dev --workspace @igo/api
```

## Deployment

- build: `npm run build --workspace @igo/api`
- start: `npm run start --workspace @igo/api`
- set `DATABASE_URL`, `JWT_SECRET`, Firebase keys, storage keys
