import type { Request, Response } from "express";
import { createBooking, getBookingById, listCustomerBookings, listWorkerBookings, saveWorkerLocation, updateBookingStatus, verifyBookingStartOtp } from "../services/booking.service.js";
import { emitBookingEvent } from "../socket/index.js";
import { createBookingSchema, submitLocationSchema, updateBookingStatusSchema, verifyStartOtpSchema } from "../validations/booking.js";

export async function createBookingController(req: Request, res: Response) {
  const payload = createBookingSchema.parse(req.body);
  const booking = await createBooking(req.auth!.id, payload);
  emitBookingEvent(String(booking.id), "booking:created", booking);
  res.status(201).json({ booking });
}

export async function listCustomerBookingsController(req: Request, res: Response) {
  const items = await listCustomerBookings(req.auth!.id);
  res.status(200).json({ items });
}

export async function listWorkerBookingsController(req: Request, res: Response) {
  const items = await listWorkerBookings(req.auth!.id);
  res.status(200).json({ items });
}

export async function getBookingController(req: Request, res: Response) {
  const booking = await getBookingById(String(req.params.bookingId));
  res.status(200).json({ booking });
}

export async function updateBookingStatusController(req: Request, res: Response) {
  const payload = updateBookingStatusSchema.parse(req.body);
  const booking = await updateBookingStatus(String(req.params.bookingId), payload.status);
  emitBookingEvent(String(booking.id), "booking:updated", booking);
  res.status(200).json({ booking });
}

export async function verifyBookingStartOtpController(req: Request, res: Response) {
  const payload = verifyStartOtpSchema.parse(req.body);
  const booking = await verifyBookingStartOtp(String(req.params.bookingId), payload.otp);
  emitBookingEvent(String(booking.id), "booking:otp-verified", booking);
  res.status(200).json({ booking });
}

export async function updateWorkerLocationController(req: Request, res: Response) {
  const payload = submitLocationSchema.parse(req.body);
  const booking = await saveWorkerLocation(payload);
  emitBookingEvent(String(booking.id), "booking:worker-location", booking);
  res.status(200).json({ booking });
}
