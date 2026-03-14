"use strict";

const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const CODES = require("../errors/ErrorCodes");

const SALT_ROUNDS = 12;

const hashPassword = async (plainText) => {
  return bcrypt.hash(plainText, SALT_ROUNDS);
};

const comparePassword = async (plainText, hash) => {
  const match = await bcrypt.compare(plainText, hash);
  if (!match) {
    throw new AppError("Incorrect password.", 401, CODES.WRONG_PASSWORD);
  }
};

module.exports = { hashPassword, comparePassword };
