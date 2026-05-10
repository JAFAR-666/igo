import type { Request, Response } from "express";
import { getWorkerDashboard, getWorkerProfile, listNearbyWorkers, updateAvailability } from "../services/worker.service.js";

export async function listWorkersController(req: Request, res: Response) {
  const items = await listNearbyWorkers(req.query.categoryId as string | undefined);
  res.status(200).json({ items });
}

export async function getWorkerProfileController(req: Request, res: Response) {
  const worker = await getWorkerProfile(String(req.params.workerId));
  res.status(200).json({ worker });
}

export async function updateAvailabilityController(req: Request, res: Response) {
  const worker = await updateAvailability(req.auth!.id, req.body.status);
  res.status(200).json({ worker });
}

export async function getWorkerDashboardController(req: Request, res: Response) {
  const dashboard = await getWorkerDashboard(req.auth!.id);
  res.status(200).json(dashboard);
}
