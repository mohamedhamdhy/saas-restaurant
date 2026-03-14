"use strict";

const { Sequelize } = require("sequelize");
const config = require("./config/Config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ?? false,
    dialectOptions: dbConfig.dialectOptions ?? {},
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const connectDatabase = async () => {
  await sequelize.authenticate();
  console.log(`[DB] PostgreSQL connected → ${dbConfig.database}`);
};

module.exports = { sequelize, connectDatabase };
