import express, { Express, Request, Response } from "express";
import cors from "cors";
import SocketService from "./services/socket";
import http from "http";
import { startKafkaConsumer } from "./services/kafka/consumer";

const initServer = async () => {
  const PORT = 5050;

  // Making express app
  const app: Express = express();

  // Making http server
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
    console.log(`Example app listening on port ${PORT}`);
  });
};

initServer();
