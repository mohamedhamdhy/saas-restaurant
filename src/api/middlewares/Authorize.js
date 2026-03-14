"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.actor) {
      return next(new AppError("Not authenticated.", 401, CODES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.actor.role)) {
      return next(
        new AppError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}.`,
          403,
          CODES.FORBIDDEN,
        ),
      );
    }

    next();
  };

module.exports = authorize;
