import { kafka, TOPICS } from "../../config/kafka.config";

const producer = kafka.producer();

interface MessagePayload {
  message: string;
}

export async function produceMessage(payload: MessagePayload) {
  try {
    await producer.connect();
    await producer.send({
      topic: TOPICS.MESSAGE,
      messages: [
        {
          value: JSON.stringify(payload),
          key: `messageAt:${new Date().toISOString()}`,
        },
      ],
    });

    // console.log("message produced to kafka broker with payload", payload);
    return true;
  } catch (error) {
    console.error("Error producing message:");
    return false;
  }
}
