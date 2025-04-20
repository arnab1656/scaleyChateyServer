import express, { Express, Request, Response } from "express";
import cors from "cors";
import SocketService from "./services/socket";
import http from "http";
import { startKafkaConsumer } from "./services/kafka/consumer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const initServer = async () => {
  // Get port from environment variable
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Making express app
  const app: Express = express();
  const httpServer = http.createServer(app);

  // Making socket service
  const socketService = new SocketService();
  socketService.getIo().attach(httpServer);
  socketService.initizingListeners();
  await startKafkaConsumer();

  // Middleware
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express + TypeScript Server!");
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initServer().catch(console.error);
