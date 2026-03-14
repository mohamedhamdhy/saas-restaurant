"use strict";

const { cleanEnv, str, port, num } = require("envalid");

const validateEnv = () =>
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ["development", "test", "production"] }),
    PORT: port({ default: 5000 }),

    DB_HOST: str(),
    DB_PORT: port({ default: 5432 }),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),

    JWT_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: "15m" }),
    JWT_REFRESH_EXPIRES_IN: str({ default: "7d" }),

    REDIS_HOST: str({ default: "localhost" }),
    REDIS_PORT: port({ default: 6379 }),

    SETUP_SECRET: str(),
  });

module.exports = validateEnv;
