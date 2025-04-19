import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: "chat-app",
  brokers: [`${process.env.PRIVATE_IP}:9092`],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export const TOPICS = {
  MESSAGE: "message",
} as const;
