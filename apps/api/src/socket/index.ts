import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("booking:join", (bookingId: string) => {
      socket.join(`booking:${bookingId}`);
    });
  });

  return io;
}

export function emitBookingEvent(bookingId: string, event: string, payload: unknown) {
  io?.to(`booking:${bookingId}`).emit(event, payload);
}
