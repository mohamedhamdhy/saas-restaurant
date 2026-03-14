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

class ResetPassword {
  constructor({ userRepository, otpRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute({ email, otp, newPassword }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid request.", 400, CODES.OTP_INVALID);
    }

    const purpose = OTP_PURPOSE.FORGOT_PASSWORD;
    const otpKey = `otp:${purpose}:${user.id}`;
    const attemptKey = buildAttemptKey(purpose, user.id);

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

    const newHash = await hashPassword(newPassword);
    await this.userRepository.update(user.id, { passwordHash: newHash });

    await this.tokenRepository.revokeAll(user.id);

    await Promise.all([
      this.otpRepository.revoke(otpKey),
      this.otpRepository.revoke(attemptKey),
    ]);

    return { message: "Password reset successfully. Please log in." };
  }
}

module.exports = ResetPassword;
