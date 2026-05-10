import type { Request, Response } from "express";
import { listCategories } from "../services/catalog.service.js";

export async function listCategoriesController(_req: Request, res: Response) {
  const items = await listCategories();
  res.status(200).json({ items });
}
