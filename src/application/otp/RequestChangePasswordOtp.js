"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const sendOtpEmail = require("../../infrastructure/mailer/SendOtpEmail");
const sendOtpSms = require("../../infrastructure/sms/SendOtpSms");
const crypto = require("crypto");
const {
  generateOtp,
  OTP_TTL_SECONDS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class RequestChangePasswordOtp {
  constructor({ otpRepository }) {
    this.otpRepository = otpRepository;
  }

  async execute(actor) {
    const purpose = OTP_PURPOSE.CHANGE_PASSWORD;
    const otpKey = `otp:${purpose}:${actor.id}`;
    const attemptKey = buildAttemptKey(purpose, actor.id);

    const plainOtp = generateOtp();
    const hashedOtp = hashOtp(plainOtp);

    await this.otpRepository.revoke(attemptKey);
    await this.otpRepository.save(otpKey, hashedOtp, OTP_TTL_SECONDS);

    await Promise.allSettled([
      sendOtpEmail(actor.email, plainOtp, purpose, actor.firstName),
      sendOtpSms(actor.phone, plainOtp, purpose),
    ]);

    return {
      message: "OTP sent to your email and phone. Expires in 5 minutes.",
    };
  }
}

module.exports = RequestChangePasswordOtp;
