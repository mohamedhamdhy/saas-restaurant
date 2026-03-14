"use strict";

require("dotenv").config();

const validateEnv = require("./shared/utils/ValidateEnv");
const logger = require("./shared/utils/Logger");
const createApp = require("./app");
const { container } = require("./infrastructure/Container");
const { connectDatabase } = require("./infrastructure/database/Connection");

validateEnv();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDatabase();

    const app = createApp(container);

    const server = app.listen(PORT, () => {
      logger.info(
        `[Server] Running on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
      logger.info(`[Server] Health → http://localhost:${PORT}/health`);
      logger.info(`[Server] API    → http://localhost:${PORT}/api/v1`);
    });

    const shutdown = async (signal) => {
      logger.warn(`[Server] ${signal} received — shutting down gracefully`);
      server.close(async () => {
        try {
          const sequelize = container.resolve("sequelize");
          await sequelize.close();
          logger.info("[DB] PostgreSQL connection closed");

          const redis = container.resolve("redisClient");
          await redis.quit();
          logger.info("[Redis] Connection closed");

          logger.info("[Server] Shutdown complete");
          process.exit(0);
        } catch (err) {
          logger.error("[Server] Error during shutdown:", err.message);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    logger.error("[Server] Failed to start:", err.message);
    logger.error(err.stack);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("[Process] Unhandled rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("[Process] Uncaught exception:", err.message);
  process.exit(1);
});

start();
