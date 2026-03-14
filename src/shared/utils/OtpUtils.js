"use strict";

const crypto = require("crypto");

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

const generateOtp = () => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  const range = max - min + 1;
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0);
  return String(min + (num % range));
};

const OTP_PURPOSE = Object.freeze({
  REGISTRATION: "registration",
  LOGIN: "login",
  CHANGE_PASSWORD: "change_password",
  FORGOT_PASSWORD: "forgot_password",
});

const buildOtpKey = (purpose, identifier) => `otp:${purpose}:${identifier}`;
const buildAttemptKey = (purpose, identifier) =>
  `otp_attempts:${purpose}:${identifier}`;

module.exports = {
  generateOtp,
  OTP_TTL_SECONDS,
  MAX_ATTEMPTS,
  OTP_PURPOSE,
  buildOtpKey,
  buildAttemptKey,
};
