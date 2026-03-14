"use strict";

const crypto = require("crypto");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { hashPassword } = require("../../shared/utils/passwordUtils");
const {
  MAX_ATTEMPTS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class ChangePasswordWithOtp {
  constructor({ userRepository, otpRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute({ userId, otp, newPassword }) {
    const purpose = OTP_PURPOSE.CHANGE_PASSWORD;
    const otpKey = `otp:${purpose}:${userId}`;
    const attemptKey = buildAttemptKey(purpose, userId);

    const attempts = await this.otpRepository.getAttempts(attemptKey);
    if (attempts >= MAX_ATTEMPTS) {
      throw new AppError(
        "Too many incorrect attempts. Request a new OTP.",
        429,
        CODES.OTP_MAX_ATTEMPTS,
      );
    }

    const storedHash = await this.otpRepository.find(otpKey);
    if (!storedHash) {
      throw new AppError(
        "OTP expired. Request a new one.",
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

    const newHash = await hashPassword(newPassword);
    await this.userRepository.update(userId, { passwordHash: newHash });

    await this.tokenRepository.revokeAll(userId);

    await Promise.all([
      this.otpRepository.revoke(otpKey),
      this.otpRepository.revoke(attemptKey),
    ]);

    return { message: "Password changed successfully. Please log in again." };
  }
}

module.exports = ChangePasswordWithOtp;
