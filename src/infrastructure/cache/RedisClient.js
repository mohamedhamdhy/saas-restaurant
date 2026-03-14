"use strict";

const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,

  retryStrategy(times) {
    if (times > 5) {
      console.error("[Redis] Max reconnection attempts reached. Giving up.");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redisClient.on("connect", () => console.log("[Redis] ✓ Connected"));
redisClient.on("ready", () => console.log("[Redis] ✓ Ready"));
redisClient.on("error", (err) =>
  console.error("[Redis] ✗ Error:", err.message),
);
redisClient.on("close", () => console.warn("[Redis] ✗ Connection closed"));

module.exports = redisClient;
