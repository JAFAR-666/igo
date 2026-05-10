import type { Request, Response } from "express";
import { adminLogin, onboardWorker, requestOtpLogin, switchMode, verifyOtpLogin } from "../services/auth.service.js";
import { adminLoginSchema, requestOtpSchema, switchModeSchema, verifyOtpSchema } from "../validations/auth.js";

export async function requestOtpController(req: Request, res: Response) {
  const payload = requestOtpSchema.parse(req.body);
  const response = await requestOtpLogin(payload);
  res.status(200).json(response);
}

export async function verifyOtpController(req: Request, res: Response) {
  const payload = verifyOtpSchema.parse(req.body);
  const response = await verifyOtpLogin(payload);
  res.status(200).json(response);
}

export async function switchModeController(req: Request, res: Response) {
  const payload = switchModeSchema.parse(req.body);
  const response = await switchMode(req.auth!.id, payload.activeMode);
  res.status(200).json(response);
}

export async function adminLoginController(req: Request, res: Response) {
  const payload = adminLoginSchema.parse(req.body);
  const response = await adminLogin(payload.email, payload.password);
  res.status(200).json(response);
}

export async function onboardWorkerController(req: Request, res: Response) {
  const response = await onboardWorker(req.auth!.id, req.body);
  res.status(201).json(response);
}
