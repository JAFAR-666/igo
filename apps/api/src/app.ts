import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
