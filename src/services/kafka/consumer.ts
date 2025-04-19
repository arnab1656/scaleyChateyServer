import { kafka, TOPICS } from "../../config/kafka.config";

const consumer = kafka.consumer({ groupId: "default-group" });

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPICS.MESSAGE, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("message received from kafka", {
          topic,
          partition,
          message: JSON.parse(message.value?.toString() || "{}"),
        });
      },
    });
  } catch (error) {
    console.error("Error consuming messages from Kafka Broker");
  }
};
