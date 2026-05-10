import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  workerId: z.string().uuid(),
  skillRating: z.number().min(1).max(5),
  behaviorRating: z.number().min(1).max(5),
  punctualityRating: z.number().min(1).max(5),
  pricingRating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});
