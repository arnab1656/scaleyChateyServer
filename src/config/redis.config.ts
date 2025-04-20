import { Redis } from "ioredis";
let redis: Redis;
if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
} else {
  redis = new Redis({
    host: "localhost",
    port: 6379,
  });
}

export default redis;
