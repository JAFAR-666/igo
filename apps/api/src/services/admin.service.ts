import { query } from "../db/pool.js";

export async function getAdminDashboard() {
  const [metrics, workers, complaints, categories] = await Promise.all([
    query(
      `
        SELECT
          (SELECT COUNT(*) FROM worker_profiles WHERE availability_status = 'online') AS active_workers,
          (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE) AS daily_bookings,
          (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'paid') AS revenue,
          (
            SELECT COUNT(*) FILTER (WHERE status IN ('cancelled', 'rejected'))::decimal
              / NULLIF(COUNT(*), 0)
            FROM bookings
          ) AS cancellation_rate
      `
    ),
    query(
      `
        SELECT wp.id, u.full_name, u.mobile, wp.verification_status, wp.availability_status, wp.experience_years
        FROM worker_profiles wp
        JOIN users u ON u.id = wp.user_id
        ORDER BY wp.created_at DESC
      `
    ),
    query(
      `
        SELECT id, subject, status, created_at
        FROM complaints
        ORDER BY created_at DESC
        LIMIT 10
      `
    ),
    query(
      `
        SELECT c.id, c.name, wr.min_hourly, wr.max_hourly, wr.min_half_day, wr.max_half_day, wr.min_full_day, wr.max_full_day
        FROM wage_ranges wr
        JOIN categories c ON c.id = wr.category_id
        ORDER BY c.name ASC
      `
    ),
  ]);

  return {
    metrics: metrics.rows[0],
    workers: workers.rows,
    complaints: complaints.rows,
    wageRanges: categories.rows,
  };
}

export async function updateWorkerVerification(workerId: string, status: "approved" | "rejected") {
  await query(
    `
      UPDATE worker_profiles
      SET verification_status = $2,
          verified_badge = CASE WHEN $2 = 'approved' THEN TRUE ELSE FALSE END,
          updated_at = NOW()
      WHERE id = $1
    `,
    [workerId, status]
  );
}

export async function updateWageRange(input: {
  categoryId: string;
  minHourly: number;
  maxHourly: number;
  minHalfDay: number;
  maxHalfDay: number;
  minFullDay: number;
  maxFullDay: number;
}) {
  await query(
    `
      UPDATE wage_ranges
      SET min_hourly = $2,
          max_hourly = $3,
          min_half_day = $4,
          max_half_day = $5,
          min_full_day = $6,
          max_full_day = $7,
          updated_at = NOW()
      WHERE category_id = $1
    `,
    [
      input.categoryId,
      input.minHourly,
      input.maxHourly,
      input.minHalfDay,
      input.maxHalfDay,
      input.minFullDay,
      input.maxFullDay,
    ]
  );
}
