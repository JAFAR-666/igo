import { randomInt } from "node:crypto";
import { query, withTransaction } from "../db/pool.js";
import { ApiError } from "../utils/errors.js";

export async function createBooking(userId: string, input: {
  categoryId: string;
  address: {
    label: string;
    contactName: string;
    mobile: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  scheduledFor: string;
  workScope: "hourly" | "half_day" | "full_day";
  description: string;
  emergencyBooking: boolean;
  media: Array<{ mediaType: "image" | "video"; mediaUrl: string }>;
}) {
  return withTransaction(async (client) => {
    const addressResult = await client.query<{ id: string }>(
      `
        INSERT INTO addresses (
          user_id, label, contact_name, mobile, line1, line2, city, state, postal_code, latitude, longitude
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `,
      [
        userId,
        input.address.label,
        input.address.contactName,
        input.address.mobile,
        input.address.line1,
        input.address.line2 || null,
        input.address.city,
        input.address.state,
        input.address.postalCode,
        input.address.latitude ?? null,
        input.address.longitude ?? null,
      ]
    );

    const worker = await pickBestWorker(input.categoryId, input.workScope);
    const bookingCode = `IGO${randomInt(100000, 999999)}`;
    const otp = String(randomInt(100000, 999999));

    const pricingResult = await client.query<{ amount: string }>(
      `
        SELECT
          CASE
            WHEN $2 = 'hourly' THEN hourly_rate
            WHEN $2 = 'half_day' THEN half_day_rate
            ELSE full_day_rate
          END::text AS amount
        FROM worker_pricing
        WHERE worker_id = $1 AND category_id = $3
        LIMIT 1
      `,
      [worker.id, input.workScope, input.categoryId]
    );

    const amount = Number(pricingResult.rows[0]?.amount || 0);

    const bookingResult = await client.query<{ id: string }>(
      `
        INSERT INTO bookings (
          booking_code, customer_id, worker_id, category_id, address_id, status,
          scheduled_for, work_scope, estimated_amount, description, emergency_booking,
          customer_otp, latitude, longitude
        )
        VALUES ($1, $2, $3, $4, $5, 'requested', $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `,
      [
        bookingCode,
        userId,
        worker.id,
        input.categoryId,
        addressResult.rows[0].id,
        input.scheduledFor,
        input.workScope,
        amount,
        input.description,
        input.emergencyBooking,
        otp,
        input.address.latitude ?? null,
        input.address.longitude ?? null,
      ]
    );

    for (const item of input.media) {
      await client.query(
        `
          INSERT INTO booking_media (booking_id, media_type, media_url)
          VALUES ($1, $2, $3)
        `,
        [bookingResult.rows[0].id, item.mediaType, item.mediaUrl]
      );
    }

    return getBookingById(bookingResult.rows[0].id);
  });
}

export async function getBookingById(bookingId: string) {
  const result = await query(
    `
      SELECT
        b.id,
        b.booking_code,
        b.status,
        b.scheduled_for,
        b.work_scope,
        b.estimated_amount,
        b.final_amount,
        b.description,
        b.emergency_booking,
        b.start_otp_verified,
        b.latitude,
        b.longitude,
        b.created_at,
        c.name AS category_name,
        u.full_name AS customer_name,
        wu.full_name AS worker_name,
        wp.id AS worker_id,
        wp.rating_average,
        wp.experience_years
      FROM bookings b
      JOIN categories c ON c.id = b.category_id
      JOIN users u ON u.id = b.customer_id
      LEFT JOIN worker_profiles wp ON wp.id = b.worker_id
      LEFT JOIN users wu ON wu.id = wp.user_id
      WHERE b.id = $1
      LIMIT 1
    `,
    [bookingId]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, "Booking not found");
  }

  return result.rows[0];
}

export async function listCustomerBookings(userId: string) {
  const result = await query(
    `
      SELECT id, booking_code, status, scheduled_for, estimated_amount, created_at
      FROM bookings
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );
  return result.rows;
}

export async function listWorkerBookings(userId: string) {
  const result = await query(
    `
      SELECT b.id, b.booking_code, b.status, b.scheduled_for, b.estimated_amount, b.description, b.created_at
      FROM bookings b
      JOIN worker_profiles wp ON wp.id = b.worker_id
      WHERE wp.user_id = $1
      ORDER BY b.created_at DESC
    `,
    [userId]
  );
  return result.rows;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const result = await query(
    `
      UPDATE bookings
      SET status = $2,
          started_at = CASE WHEN $2 = 'in_progress' THEN NOW() ELSE started_at END,
          completed_at = CASE WHEN $2 = 'completed' THEN NOW() ELSE completed_at END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `,
    [bookingId, status]
  );
  if (result.rowCount === 0) {
    throw new ApiError(404, "Booking not found");
  }
  return getBookingById(bookingId);
}

export async function verifyBookingStartOtp(bookingId: string, otp: string) {
  const result = await query<{ customer_otp: string }>(
    `SELECT customer_otp FROM bookings WHERE id = $1 LIMIT 1`,
    [bookingId]
  );
  const booking = result.rows[0];
  if (!booking || booking.customer_otp !== otp) {
    throw new ApiError(400, "Invalid booking OTP");
  }

  await query(
    `
      UPDATE bookings
      SET start_otp_verified = TRUE,
          status = 'in_progress',
          started_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
    `,
    [bookingId]
  );
  return getBookingById(bookingId);
}

export async function saveWorkerLocation(input: { bookingId: string; latitude: number; longitude: number }) {
  await query(
    `
      INSERT INTO booking_locations (booking_id, actor_type, latitude, longitude)
      VALUES ($1, 'worker', $2, $3)
    `,
    [input.bookingId, input.latitude, input.longitude]
  );

  await query(
    `
      UPDATE bookings
      SET latitude = $2,
          longitude = $3,
          updated_at = NOW()
      WHERE id = $1
    `,
    [input.bookingId, input.latitude, input.longitude]
  );

  return getBookingById(input.bookingId);
}

async function pickBestWorker(categoryId: string, workScope: "hourly" | "half_day" | "full_day") {
  const result = await query<{
    id: string;
    hourly_rate: string;
    half_day_rate: string;
    full_day_rate: string;
    rating_average: string;
    completed_jobs: number;
  }>(
    `
      SELECT wp.id, wp.rating_average, wp.completed_jobs, wp.availability_status,
             p.hourly_rate, p.half_day_rate, p.full_day_rate
      FROM worker_profiles wp
      JOIN worker_pricing p ON p.worker_id = wp.id
      WHERE p.category_id = $1
        AND wp.verification_status = 'approved'
        AND wp.availability_status IN ('online', 'busy')
      ORDER BY wp.rating_average DESC, wp.completed_jobs DESC, p.hourly_rate ASC
      LIMIT 1
    `,
    [categoryId]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, `No active workers available for ${workScope} requests right now`);
  }

  return result.rows[0];
}
