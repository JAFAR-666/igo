import { query } from "../db/pool.js";

export async function createReview(customerId: string, input: {
  bookingId: string;
  workerId: string;
  skillRating: number;
  behaviorRating: number;
  punctualityRating: number;
  pricingRating: number;
  comment?: string;
}) {
  await query(
    `
      INSERT INTO reviews (
        booking_id, customer_id, worker_id, skill_rating, behavior_rating,
        punctuality_rating, pricing_rating, comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      input.bookingId,
      customerId,
      input.workerId,
      input.skillRating,
      input.behaviorRating,
      input.punctualityRating,
      input.pricingRating,
      input.comment || null,
    ]
  );

  await query(
    `
      UPDATE worker_profiles
      SET
        total_reviews = total_reviews + 1,
        rating_average = (
          SELECT ROUND(AVG((skill_rating + behavior_rating + punctuality_rating + pricing_rating) / 4.0), 2)
          FROM reviews
          WHERE worker_id = $1
        )
      WHERE id = $1
    `,
    [input.workerId]
  );
}
