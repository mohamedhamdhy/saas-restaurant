"use strict";

const crypto = require("crypto");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_TTL_SECONDS,
} = require("../../shared/utils/TokenUtils");
const {
  MAX_ATTEMPTS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class VerifyLoginOtp {
  constructor({ userRepository, otpRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute({ userId, otp }) {
    const purpose = OTP_PURPOSE.LOGIN;
    const otpKey = `otp:${purpose}:${userId}`;
    const attemptKey = buildAttemptKey(purpose, userId);

    const attempts = await this.otpRepository.getAttempts(attemptKey);
    if (attempts >= MAX_ATTEMPTS) {
      throw new AppError(
        "Too many incorrect attempts. Please log in again.",
        429,
        CODES.OTP_MAX_ATTEMPTS,
      );
    }

    const storedHash = await this.otpRepository.find(otpKey);
    if (!storedHash) {
      throw new AppError(
        "OTP has expired. Please log in again.",
        410,
        CODES.OTP_EXPIRED,
      );
    }

    const incomingHash = hashOtp(String(otp));
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(storedHash),
      Buffer.from(incomingHash),
    );

    if (!isMatch) {
      await this.otpRepository.incrementAttempts(attemptKey);
      throw new AppError("Invalid OTP.", 400, CODES.OTP_INVALID);
    }

    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive()) {
      throw new AppError(
        "User not found or inactive.",
        401,
        CODES.UNAUTHORIZED,
      );
    }

    const tokenPayload = user.toTokenPayload();
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ sub: user.id });

    await this.tokenRepository.save(
      user.id,
      refreshToken,
      REFRESH_TOKEN_TTL_SECONDS,
    );
    this.userRepository.updateLastLogin(user.id).catch(() => {});

    await Promise.all([
      this.otpRepository.revoke(otpKey),
      this.otpRepository.revoke(attemptKey),
    ]);

    return { accessToken, refreshToken, user: user.toPublicJSON() };
  }
}

module.exports = VerifyLoginOtp;
