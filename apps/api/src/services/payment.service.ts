import { query } from "../db/pool.js";

export async function capturePayment(input: {
  bookingId: string;
  paymentMode: "cash" | "upi";
  amount: number;
  paymentStatus: "paid" | "pending";
  transactionRef?: string;
}) {
  await query(
    `
      INSERT INTO payments (booking_id, payment_mode, payment_status, amount, transaction_ref)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (booking_id) DO UPDATE SET
        payment_mode = EXCLUDED.payment_mode,
        payment_status = EXCLUDED.payment_status,
        amount = EXCLUDED.amount,
        transaction_ref = EXCLUDED.transaction_ref
    `,
    [input.bookingId, input.paymentMode, input.paymentStatus, input.amount, input.transactionRef || null]
  );

  await query(
    `
      UPDATE bookings
      SET final_amount = $2,
          status = CASE WHEN $3 = 'paid' THEN 'completed' ELSE status END,
          updated_at = NOW()
      WHERE id = $1
    `,
    [input.bookingId, input.amount, input.paymentStatus]
  );
}
