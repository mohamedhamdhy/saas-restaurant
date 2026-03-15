"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { verifyAccessToken } = require("../../shared/utils/TokenUtils");

const authenticate = (userRepository) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided.", 401, CODES.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.tokenPayload = decoded;

    const user = await userRepository.findById(decoded.sub);
    if (!user) {
      throw new AppError("User not found.", 401, CODES.UNAUTHORIZED);
    }
    if (!user.isActive()) {
      throw new AppError(
        `Account is ${user.status}.`,
        403,
        CODES.USER_INACTIVE,
      );
    }

    req.actor = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
