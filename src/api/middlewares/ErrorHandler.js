"use strict";

const errorHandler = (err, req, res, next) => {
  console.error("[ERROR DETAILS]", {
    message: err.message,
    code: err.code,
    isOperational: err.isOperational,
    stack: err.stack,
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: err.errors?.[0]?.message || "Database validation error.",
    });
  }

  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorHandler;
