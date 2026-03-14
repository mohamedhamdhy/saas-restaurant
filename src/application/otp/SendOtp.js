"use strict";

const crypto = require("crypto");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const sendOtpEmail = require("../../infrastructure/mailer/SendOtpEmail");
const sendOtpSms = require("../../infrastructure/sms/SendOtpSms");
const {
  generateOtp,
  OTP_TTL_SECONDS,
  buildOtpKey,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class SendOtp {
  constructor({ userRepository, otpRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  /**
   * @param {string} identifier  userId (most flows) or email (forgot_password)
   * @param {string} purpose     OTP_PURPOSE value
   * @param {object} opts        { email, phone, firstName } — avoids extra DB call if already known
   */
  async execute(identifier, purpose, opts = {}) {
    let { email, phone, firstName } = opts;

    if (!email) {
      const user = await this.userRepository.findById(identifier);
      if (!user)
        throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
      email = user.email;
      phone = user.phone;
      firstName = user.firstName;
    }

    const plainOtp = generateOtp();
    const hashedOtp = hashOtp(plainOtp);

    const otpKey = buildOtpKey(buildAttemptKey, purpose, identifier);
    const attemptKey = buildAttemptKey(purpose, identifier);

    await this.otpRepository.revoke(attemptKey);

    const otpRedisKey = `otp:${purpose}:${identifier}`;
    await this.otpRepository.save(otpRedisKey, hashedOtp, OTP_TTL_SECONDS);

    await Promise.allSettled([
      sendOtpEmail(email, plainOtp, purpose, firstName),
      sendOtpSms(phone, plainOtp, purpose),
    ]);

    return {
      message: `OTP sent to your email and phone. Expires in 5 minutes.`,
    };
  }
}

module.exports = SendOtp;
