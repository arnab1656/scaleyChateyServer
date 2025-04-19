import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../config/config.redis";
import { produceMessage } from "./kafka/producer";

interface CustomSocket extends Socket {
  room?: string;
}

class SocketService {
  private static _instance: SocketService;
  private _io: Server;

  constructor() {
    console.log("socket constructor");

    // Initialize the socket server
    this._io = new Server({
      adapter: createAdapter(pubClient, subClient),
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    SocketService._instance = this;
  }

  private socketMiddleware(io: Server) {
    io.use((socket: CustomSocket, next) => {
      const room = socket.handshake.auth.room || socket.handshake.headers.room;

      if (!room) {
        next(new Error("Invalid room"));
      }

      // Set the room to the socket
      socket.room = room;
      next();
    });
  }

  public initizingListeners() {
    const io = SocketService._instance.getIo();

    this.socketMiddleware(io);

    io.on("connection", (socket: CustomSocket) => {
      console.log("a user connected with id", socket.id);

      socket.join(socket.room!);

      socket.on("message", async (message: string) => {
        socket.to(socket.room!).emit("incoming-message", {
          type: "incoming-message",
          socketId: socket.id,
          message,
        });

        await produceMessage({ message });
      });

      socket.on("disconnect", () => {
        console.log("user disconnected with id", socket.id);
      });
    });
  }

  // Normal way
  public getIo() {
    return this._io;
  }

  // Getter way
  // get io() {
  //   return this._io;
  // }
}

export default SocketService;
