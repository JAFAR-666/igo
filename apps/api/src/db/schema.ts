import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { query } from "./pool.js";

export async function initializeDatabase() {
  await query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      mobile VARCHAR(15) NOT NULL UNIQUE,
      email VARCHAR(255),
      full_name VARCHAR(120) NOT NULL,
      preferred_language VARCHAR(16) NOT NULL DEFAULT 'en',
      active_mode VARCHAR(16) NOT NULL DEFAULT 'customer',
      is_customer_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      is_worker_enabled BOOLEAN NOT NULL DEFAULT FALSE,
      is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
      firebase_uid VARCHAR(128),
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name VARCHAR(120) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'super_admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(80) NOT NULL UNIQUE,
      name VARCHAR(80) NOT NULL,
      icon VARCHAR(48) NOT NULL,
      description TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS worker_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT NOT NULL DEFAULT '',
      experience_years INTEGER NOT NULL DEFAULT 0,
      skills_text TEXT NOT NULL DEFAULT '',
      voice_skills_text TEXT NOT NULL DEFAULT '',
      languages TEXT[] NOT NULL DEFAULT ARRAY['Hindi'],
      service_radius_km NUMERIC(6, 2) NOT NULL DEFAULT 10,
      verification_status VARCHAR(16) NOT NULL DEFAULT 'pending',
      verified_badge BOOLEAN NOT NULL DEFAULT FALSE,
      availability_status VARCHAR(16) NOT NULL DEFAULT 'offline',
      latitude NUMERIC(10, 7),
      longitude NUMERIC(10, 7),
      rating_average NUMERIC(3, 2) NOT NULL DEFAULT 0,
      total_reviews INTEGER NOT NULL DEFAULT 0,
      completed_jobs INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS worker_categories (
      worker_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      PRIMARY KEY (worker_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS wage_ranges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID NOT NULL UNIQUE REFERENCES categories(id) ON DELETE CASCADE,
      min_hourly NUMERIC(10, 2) NOT NULL,
      max_hourly NUMERIC(10, 2) NOT NULL,
      min_half_day NUMERIC(10, 2) NOT NULL,
      max_half_day NUMERIC(10, 2) NOT NULL,
      min_full_day NUMERIC(10, 2) NOT NULL,
      max_full_day NUMERIC(10, 2) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS worker_pricing (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      worker_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      hourly_rate NUMERIC(10, 2) NOT NULL,
      half_day_rate NUMERIC(10, 2) NOT NULL,
      full_day_rate NUMERIC(10, 2) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE (worker_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label VARCHAR(80) NOT NULL,
      contact_name VARCHAR(120) NOT NULL,
      mobile VARCHAR(15) NOT NULL,
      line1 TEXT NOT NULL,
      line2 TEXT,
      city VARCHAR(120) NOT NULL,
      state VARCHAR(120) NOT NULL,
      postal_code VARCHAR(16) NOT NULL,
      latitude NUMERIC(10, 7),
      longitude NUMERIC(10, 7),
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_code VARCHAR(20) NOT NULL UNIQUE,
      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      worker_id UUID REFERENCES worker_profiles(id) ON DELETE SET NULL,
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
      status VARCHAR(24) NOT NULL DEFAULT 'searching',
      scheduled_for TIMESTAMPTZ NOT NULL,
      work_scope VARCHAR(24) NOT NULL DEFAULT 'hourly',
      estimated_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
      final_amount NUMERIC(10, 2),
      description TEXT NOT NULL,
      emergency_booking BOOLEAN NOT NULL DEFAULT FALSE,
      customer_otp VARCHAR(6),
      start_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
      latitude NUMERIC(10, 7),
      longitude NUMERIC(10, 7),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS booking_media (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      media_type VARCHAR(16) NOT NULL,
      media_url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS booking_locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      actor_type VARCHAR(16) NOT NULL,
      latitude NUMERIC(10, 7) NOT NULL,
      longitude NUMERIC(10, 7) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
      payment_mode VARCHAR(24) NOT NULL,
      payment_status VARCHAR(24) NOT NULL DEFAULT 'pending',
      transaction_ref VARCHAR(120),
      amount NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      worker_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
      skill_rating INTEGER NOT NULL CHECK (skill_rating BETWEEN 1 AND 5),
      behavior_rating INTEGER NOT NULL CHECK (behavior_rating BETWEEN 1 AND 5),
      punctuality_rating INTEGER NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
      pricing_rating INTEGER NOT NULL CHECK (pricing_rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
      transaction_type VARCHAR(24) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      reference_id UUID,
      note TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(160) NOT NULL,
      body TEXT NOT NULL,
      notification_type VARCHAR(40) NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS worker_documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      worker_id UUID NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
      document_type VARCHAR(40) NOT NULL,
      document_url TEXT NOT NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'pending',
      reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
      reviewed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
      reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject VARCHAR(160) NOT NULL,
      details TEXT NOT NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
      action_type VARCHAR(80) NOT NULL,
      target_table VARCHAR(80) NOT NULL,
      target_id UUID,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_active_mode ON users(active_mode);
    CREATE INDEX IF NOT EXISTS idx_worker_profiles_status ON worker_profiles(verification_status, availability_status);
    CREATE INDEX IF NOT EXISTS idx_bookings_customer_status ON bookings(customer_id, status);
    CREATE INDEX IF NOT EXISTS idx_bookings_worker_status ON bookings(worker_id, status);
    CREATE INDEX IF NOT EXISTS idx_bookings_category ON bookings(category_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created ON wallet_transactions(wallet_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_reviews_worker_created ON reviews(worker_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_worker_documents_worker_status ON worker_documents(worker_id, status);
    CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status, created_at DESC);
  `);

  await seedBaseData();
}

async function seedBaseData() {
  const categories = [
    ["electrician", "Electrician", "flash-outline", "Home wiring, fittings, and urgent electrical support"],
    ["plumber", "Plumber", "water-outline", "Leak fixing, tap fitting, and drainage work"],
    ["carpenter", "Carpenter", "hammer-outline", "Furniture repair and woodwork tasks"],
    ["painter", "Painter", "color-fill-outline", "Wall painting, touch-up, and coating jobs"],
    ["welder", "Welder", "construct-outline", "Steel gate, grill, and fabrication work"],
    ["mason", "Mason", "business-outline", "Brick, concrete, and civil repair work"],
    ["ac-mechanic", "AC Mechanic", "snow-outline", "AC servicing, repair, and installation"],
    ["driver", "Driver", "car-outline", "Temporary private and commercial driver support"],
    ["cleaner", "Cleaner", "sparkles-outline", "Home, office, and move-in cleaning"],
    ["construction-worker", "Construction Worker", "build-outline", "General site work and labour support"],
    ["helper", "Helper", "people-outline", "General assistance for lifting and chores"],
    ["packers-movers", "Packers & Movers", "cube-outline", "Packing, loading, unloading, shifting"],
    ["cctv-technician", "CCTV Technician", "videocam-outline", "Camera installation and repair"],
    ["home-repair", "Home Repair Worker", "home-outline", "Multi-skill home fixes and maintenance"]
  ];

  for (const [slug, name, icon, description] of categories) {
    await query(
      `
        INSERT INTO categories (slug, name, icon, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description
      `,
      [slug, name, icon, description]
    );
  }

  await query(`
    INSERT INTO wage_ranges (category_id, min_hourly, max_hourly, min_half_day, max_half_day, min_full_day, max_full_day)
    SELECT id, 250, 900, 700, 2500, 1200, 4500
    FROM categories
    ON CONFLICT (category_id) DO NOTHING
  `);

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  await query(
    `
      INSERT INTO admin_users (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name
    `,
    [env.ADMIN_EMAIL, passwordHash, "igo Admin"]
  );
}
