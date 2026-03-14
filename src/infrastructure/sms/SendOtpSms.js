"use strict";

const { getSmsClient } = require("./SmsClient");
const logger = require("../../shared/utils/Logger");

const actions = {
  registration: "complete your registration",
  login: "log in",
  change_password: "change your password",
  forgot_password: "reset your password",
};

/**
 * @param {string} to
 * @param {string} otp
 * @param {string} purpose
 */
const sendOtpSms = async (to, otp, purpose) => {
  if (!to) {
    logger.warn("[SMS] No phone number provided — skipping SMS");
    return;
  }

  const body = `Your Restaurant SaaS code to ${actions[purpose] || "verify"}: ${otp}. Valid for 5 minutes. Do not share this code.`;

  try {
    await getSmsClient().messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    logger.info(`[SMS] OTP sent → ${to} [${purpose}]`);
  } catch (err) {
    logger.error(`[SMS] Failed to send OTP → ${to}:`, err.message);
  }
};

module.exports = sendOtpSms;
