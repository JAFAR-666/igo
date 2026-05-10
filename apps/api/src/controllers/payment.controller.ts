import type { Request, Response } from "express";
import { capturePayment } from "../services/payment.service.js";

export async function capturePaymentController(req: Request, res: Response) {
  await capturePayment(req.body);
  res.status(200).json({ message: "Payment captured" });
}
