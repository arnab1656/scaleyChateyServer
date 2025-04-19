import { Redis } from "ioredis";

const pubClient = new Redis({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

export { pubClient, subClient };
