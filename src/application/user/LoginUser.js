"use strict";

const crypto = require("crypto");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { comparePassword } = require("../../shared/utils/passwordUtils");
const sendOtpEmail = require("../../infrastructure/mailer/sendOtpEmail");
const sendOtpSms = require("../../infrastructure/sms/sendOtpSms");
const {
  generateOtp,
  OTP_TTL_SECONDS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class LoginUser {
  constructor({ userRepository, otpRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        "Invalid email or password.",
        401,
        CODES.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive()) {
      throw new AppError(
        `Account is ${user.status}. Please contact support.`,
        403,
        CODES.USER_INACTIVE,
      );
    }

    await comparePassword(password, user.passwordHash);

    const purpose = OTP_PURPOSE.LOGIN;
    const otpKey = `otp:${purpose}:${user.id}`;
    const attemptKey = buildAttemptKey(purpose, user.id);

    const plainOtp = generateOtp();
    const hashedOtp = hashOtp(plainOtp);

    await this.otpRepository.revoke(attemptKey);
    await this.otpRepository.save(otpKey, hashedOtp, OTP_TTL_SECONDS);

    await Promise.allSettled([
      sendOtpEmail(user.email, plainOtp, purpose, user.firstName),
      sendOtpSms(user.phone, plainOtp, purpose),
    ]);

    return {
      message: "Password verified. OTP sent to your email and phone.",
      userId: user.id,
    };
  }
}

module.exports = LoginUser;
