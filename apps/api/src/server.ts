import http from "node:http";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { initializeDatabase } from "./db/schema.js";
import { initializeSocket } from "./socket/index.js";

async function bootstrap() {
  await initializeDatabase();

  const app = createApp();
  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.PORT, () => {
    console.log(`igo API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start igo API", error);
  process.exit(1);
});
