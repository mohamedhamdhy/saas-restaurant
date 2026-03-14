"use strict";

const crypto = require("crypto");
const sendOtpEmail = require("../../infrastructure/mailer/SendOtpEmail");
const sendOtpSms = require("../../infrastructure/sms/SendOtpSms");
const logger = require("../../shared/utils/Logger");
const {
  generateOtp,
  OTP_TTL_SECONDS,
  OTP_PURPOSE,
  buildAttemptKey,
} = require("../../shared/utils/OtpUtils");

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

class ForgotPassword {
  constructor({ userRepository, otpRepository }) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  async execute({ email }) {
    const genericMsg = {
      message: "If that email exists, an OTP has been sent.",
    };

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`[ForgotPassword] Unknown email attempted: ${email}`);
      return genericMsg;
    }

    const purpose = OTP_PURPOSE.FORGOT_PASSWORD;
    const identifier = user.id;
    const otpKey = `otp:${purpose}:${identifier}`;
    const attemptKey = buildAttemptKey(purpose, identifier);

    const plainOtp = generateOtp();
    const hashedOtp = hashOtp(plainOtp);

    await this.otpRepository.revoke(attemptKey);
    await this.otpRepository.save(otpKey, hashedOtp, OTP_TTL_SECONDS);

    await Promise.allSettled([
      sendOtpEmail(user.email, plainOtp, purpose, user.firstName),
      sendOtpSms(user.phone, plainOtp, purpose),
    ]);

    return genericMsg;
  }
}

module.exports = ForgotPassword;
