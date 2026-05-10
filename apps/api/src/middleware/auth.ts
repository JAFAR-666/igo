import type { NextFunction, Request, Response } from "express";
import { query } from "../db/pool.js";
import { verifyAccessToken } from "../utils/auth.js";
import { ApiError } from "../utils/errors.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        id: string;
        role: "user" | "admin";
        activeMode?: "customer" | "worker";
        profile?: Record<string, unknown>;
      };
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyAccessToken(token);
  req.auth = { id: payload.sub, role: payload.role, activeMode: payload.activeMode };
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.auth?.role !== "admin") {
    next(new ApiError(403, "Admin access required"));
    return;
  }
  next();
}

export async function requireUserMode(mode: "customer" | "worker", req: Request) {
  if (req.auth?.role !== "user") {
    throw new ApiError(403, "User account required");
  }

  const result = await query<{
    id: string;
    active_mode: "customer" | "worker";
    is_worker_enabled: boolean;
  }>(
    `
      SELECT id, active_mode, is_worker_enabled
      FROM users
      WHERE id = $1
    `,
    [req.auth.id]
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  if (mode === "worker" && !user.is_worker_enabled) {
    throw new ApiError(403, "Worker mode not enabled for this account");
  }
}
