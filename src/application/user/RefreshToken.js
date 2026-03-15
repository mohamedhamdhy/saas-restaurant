"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_TTL_SECONDS,
} = require("../../shared/utils/TokenUtils");

class RefreshToken {
  constructor({ userRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute({ refreshToken }) {
    const decoded = verifyRefreshToken(refreshToken);

    const stored = await this.tokenRepository.find(decoded.sub);
    if (!stored || stored !== refreshToken) {
      throw new AppError(
        "Refresh token is invalid or has been revoked.",
        401,
        CODES.REFRESH_TOKEN_INVALID,
      );
    }

    const user = await this.userRepository.findById(decoded.sub);
    if (!user || !user.isActive()) {
      await this.tokenRepository.revoke(decoded.sub);
      throw new AppError(
        "User not found or inactive.",
        401,
        CODES.UNAUTHORIZED,
      );
    }

    const tokenPayload = user.toTokenPayload();

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ sub: user.id });

    await this.tokenRepository.save(
      user.id,
      newRefreshToken,
      REFRESH_TOKEN_TTL_SECONDS,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

module.exports = RefreshToken;
