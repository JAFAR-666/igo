import type { Request, Response } from "express";
import { createReview } from "../services/review.service.js";
import { createReviewSchema } from "../validations/review.js";

export async function createReviewController(req: Request, res: Response) {
  const payload = createReviewSchema.parse(req.body);
  await createReview(req.auth!.id, payload);
  res.status(201).json({ message: "Review saved" });
}
