import { Producer } from "kafkajs/types";
import { kafka } from "../../config/kafka.config";

let producer: Producer | null = null;

export const createKafkaProducer = async () => {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();

  producer = _producer;
  return producer;
};
