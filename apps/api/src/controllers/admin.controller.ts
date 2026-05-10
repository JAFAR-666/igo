import type { Request, Response } from "express";
import { getAdminDashboard, updateWageRange, updateWorkerVerification } from "../services/admin.service.js";

export async function getAdminDashboardController(_req: Request, res: Response) {
  const dashboard = await getAdminDashboard();
  res.status(200).json(dashboard);
}

export async function verifyWorkerController(req: Request, res: Response) {
  await updateWorkerVerification(String(req.params.workerId), req.body.status);
  res.status(200).json({ message: "Worker verification updated" });
}

export async function updateWageRangeController(req: Request, res: Response) {
  await updateWageRange(req.body);
  res.status(200).json({ message: "Wage range updated" });
}
