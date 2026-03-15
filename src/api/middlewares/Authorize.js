"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.actor) {
      return next(new AppError("Not authenticated.", 401, CODES.UNAUTHORIZED));
    }

    const userRoles = req.actor.roles.map((r) => r.role);
    const hasRole = allowedRoles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      return next(
        new AppError(
          `Access denied. Required: ${allowedRoles.join(", ")}.`,
          403,
          CODES.FORBIDDEN,
        ),
      );
    }

    next();
  };

module.exports = authorize;
