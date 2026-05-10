# igo Architecture

## Product Principles

- Single app, dual mode: one identity can act as customer and worker
- Indian market first: simple flows, large touch targets, quick loading
- MVP now, scale later: normalized schema, modular services, strict auth boundaries

## High-Level System

```text
Expo Mobile App
  -> Express API
  -> Socket.IO realtime channel
  -> PostgreSQL
  -> Firebase Auth / FCM
  -> Cloudinary

React Admin Dashboard
  -> Express API
```

## API Modules

- auth
- users
- categories
- workers
- bookings
- payments
- reviews
- notifications
- admin

## Realtime Events

- `booking:created`
- `booking:updated`
- `booking:accepted`
- `booking:worker-location`
- `booking:otp-issued`
- `notification:new`

## Database Highlights

- `users` holds base identity
- `worker_profiles` extends users for worker-specific details
- `worker_documents` stores KYC metadata
- `bookings` tracks full lifecycle
- `booking_locations` keeps location history
- `wallet_transactions` supports future payouts
- `admin_actions` provides auditability

## Scaling Path

- swap demo OTP with Firebase phone auth verification
- move uploads from metadata-only MVP to signed Cloudinary uploads
- add Redis for volatile booking state
- add background jobs for reminders, fraud, payout settlement
