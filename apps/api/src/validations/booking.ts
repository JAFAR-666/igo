import { z } from "zod";

export const createBookingSchema = z.object({
  categoryId: z.string().uuid(),
  address: z.object({
    label: z.string().min(2),
    contactName: z.string().min(2),
    mobile: z.string().min(10).max(15),
    line1: z.string().min(3),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(4),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  scheduledFor: z.string(),
  workScope: z.enum(["hourly", "half_day", "full_day"]),
  description: z.string().min(5),
  emergencyBooking: z.boolean().default(false),
  media: z.array(z.object({
    mediaType: z.enum(["image", "video"]),
    mediaUrl: z.string().url(),
  })).default([]),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    "requested",
    "accepted",
    "arriving",
    "in_progress",
    "completed",
    "cancelled",
    "rejected",
  ]),
});

export const verifyStartOtpSchema = z.object({
  otp: z.string().length(6),
});

export const submitLocationSchema = z.object({
  bookingId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
});
