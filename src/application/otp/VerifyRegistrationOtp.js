"use strict";

const crypto = require("crypto");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const UserStatus = require("../../domain/enums/UserStatus");
const {
  MAX_ATTEMPTS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class VerifyRegistrationOtp {
  constructor({ userRepository, otpRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  async execute({ userId, otp }) {
    const purpose = OTP_PURPOSE.REGISTRATION;
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
        "OTP has expired. Please request a new one.",
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
    if (!user) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (user.isEmailVerified && user.status === UserStatus.ACTIVE) {
      throw new AppError(
        "Account is already verified.",
        409,
        CODES.OTP_ALREADY_VERIFIED,
      );
    }

    await this.userRepository.update(userId, {
      isEmailVerified: true,
      status: UserStatus.ACTIVE,
    });

    await Promise.all([
      this.otpRepository.revoke(otpKey),
      this.otpRepository.revoke(attemptKey),
    ]);

    return { message: "Email verified successfully. You can now log in." };
  }
}

module.exports = VerifyRegistrationOtp;
