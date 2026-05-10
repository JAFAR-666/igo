import { z } from "zod";

export const requestOtpSchema = z.object({
  mobile: z.string().min(10).max(15),
  fullName: z.string().min(2).max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const verifyOtpSchema = z.object({
  mobile: z.string().min(10).max(15),
  otp: z.string().length(6),
  activeMode: z.enum(["customer", "worker"]).default("customer"),
});

export const switchModeSchema = z.object({
  activeMode: z.enum(["customer", "worker"]),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
