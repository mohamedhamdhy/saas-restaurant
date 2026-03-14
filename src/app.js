"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const pinoHttp = require("pino-http");
const logger = require("./shared/utils/Logger");
const errorHandler = require("./api/middlewares/ErrorHandler");
const notFound = require("./api/middlewares/NotFound");
const authenticate = require("./api/middlewares/Authenticate");
const userRoutes = require("./api/routes/userRoutes");
const otpRoutes = require("./api/routes/OtpRoutes");
const restaurantRoutes = require("./api/routes/RestaurantRoutes");
const branchRoutes = require("./api/routes/BranchRoutes");
const { API_PREFIX } = require("./shared/constants/Index");

const createApp = (container) => {
  const app = express();
  app.use(helmet());
  app.use(hpp());

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-setup-secret"],
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());
  app.use(compression());
  app.use(pinoHttp({ logger }));

  app.use(
    API_PREFIX,
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again later.",
      },
    }),
  );

  app.use(
    `${API_PREFIX}/auth`,
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: {
        success: false,
        code: "TOO_MANY_REQUESTS",
        message: "Too many auth attempts. Please try again in 15 minutes.",
      },
    }),
  );

  const userRepository = container.resolve("userRepository");
  const userController = container.resolve("userController");
  const otpController = container.resolve("otpController");
  const restaurantController = container.resolve("restaurantController");
  const branchController = container.resolve("branchController");

  const authMiddleware = authenticate(userRepository);

  app.use(API_PREFIX, userRoutes(userController, authMiddleware));
  app.use(API_PREFIX, otpRoutes(otpController, authMiddleware));
  app.use(API_PREFIX, restaurantRoutes(restaurantController, authMiddleware));
  app.use(API_PREFIX, branchRoutes(branchController, authMiddleware));

  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      status: "ok",
      env: process.env.NODE_ENV,
      ts: new Date().toISOString(),
    });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
