import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
    detail: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}
