"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

const setupGuard = (req, res, next) => {
  const secret = req.headers["x-setup-secret"];
  const validSecret = process.env.SETUP_SECRET;

  if (!validSecret) {
    return next(
      new AppError(
        "SETUP_SECRET is not configured.",
        500,
        CODES.INTERNAL_ERROR,
      ),
    );
  }

  if (!secret || secret !== validSecret) {
    return next(
      new AppError("Invalid or missing setup secret.", 403, CODES.FORBIDDEN),
    );
  }

  next();
};

module.exports = setupGuard;
