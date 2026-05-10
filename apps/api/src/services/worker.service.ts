import { query } from "../db/pool.js";
import { ApiError } from "../utils/errors.js";

export async function listNearbyWorkers(categoryId?: string) {
  const result = await query(
    `
      SELECT
        wp.id,
        u.full_name,
        u.avatar_url,
        wp.experience_years,
        wp.skills_text,
        wp.languages,
        wp.rating_average,
        wp.verification_status,
        wp.availability_status,
        p.hourly_rate,
        p.half_day_rate,
        p.full_day_rate,
        c.name AS category_name,
        c.id AS category_id
      FROM worker_profiles wp
      JOIN users u ON u.id = wp.user_id
      JOIN worker_pricing p ON p.worker_id = wp.id
      JOIN categories c ON c.id = p.category_id
      WHERE wp.verification_status = 'approved'
        AND ($1::uuid IS NULL OR c.id = $1::uuid)
      ORDER BY wp.rating_average DESC, wp.completed_jobs DESC
    `,
    [categoryId || null]
  );
  return result.rows;
}

export async function getWorkerProfile(workerId: string) {
  const result = await query(
    `
      SELECT
        wp.id,
        u.full_name,
        u.mobile,
        u.avatar_url,
        wp.bio,
        wp.experience_years,
        wp.skills_text,
        wp.voice_skills_text,
        wp.languages,
        wp.rating_average,
        wp.total_reviews,
        wp.completed_jobs,
        wp.verification_status,
        wp.availability_status
      FROM worker_profiles wp
      JOIN users u ON u.id = wp.user_id
      WHERE wp.id = $1
      LIMIT 1
    `,
    [workerId]
  );
  if (result.rowCount === 0) {
    throw new ApiError(404, "Worker not found");
  }
  return result.rows[0];
}

export async function updateAvailability(userId: string, status: "online" | "offline" | "busy") {
  const result = await query(
    `
      UPDATE worker_profiles
      SET availability_status = $2, updated_at = NOW()
      WHERE user_id = $1
      RETURNING id, availability_status
    `,
    [userId, status]
  );
  if (result.rowCount === 0) {
    throw new ApiError(404, "Worker profile not found");
  }
  return result.rows[0];
}

export async function getWorkerDashboard(userId: string) {
  const [summary, pricing, recentBookings] = await Promise.all([
    query(
      `
        SELECT
          wp.id,
          wp.rating_average,
          wp.completed_jobs,
          wp.availability_status,
          COALESCE(SUM(CASE WHEN b.status = 'completed' THEN COALESCE(b.final_amount, b.estimated_amount) ELSE 0 END), 0) AS earnings
        FROM worker_profiles wp
        LEFT JOIN bookings b ON b.worker_id = wp.id
        WHERE wp.user_id = $1
        GROUP BY wp.id
      `,
      [userId]
    ),
    query(
      `
        SELECT c.name AS category_name, p.hourly_rate, p.half_day_rate, p.full_day_rate
        FROM worker_profiles wp
        JOIN worker_pricing p ON p.worker_id = wp.id
        JOIN categories c ON c.id = p.category_id
        WHERE wp.user_id = $1
      `,
      [userId]
    ),
    query(
      `
        SELECT booking_code, status, estimated_amount, created_at
        FROM bookings b
        JOIN worker_profiles wp ON wp.id = b.worker_id
        WHERE wp.user_id = $1
        ORDER BY b.created_at DESC
        LIMIT 6
      `,
      [userId]
    ),
  ]);

  return {
    summary: summary.rows[0] || null,
    pricing: pricing.rows,
    recentBookings: recentBookings.rows,
  };
}
