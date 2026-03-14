"use strict";

const transporter = require("./MailerClient");
const logger = require("../../shared/utils/Logger");

/**
 * @param {string} to
 * @param {string} otp
 * @param {string} purpose
 * @param {string} firstName
 */
const sendOtpEmail = async (to, otp, purpose, firstName = "User") => {
  const subjects = {
    registration: "Verify your email — Restaurant SaaS",
    login: "Your login verification code",
    change_password: "Password change verification code",
    forgot_password: "Reset your password",
  };

  const actions = {
    registration: "complete your registration",
    login: "log in to your account",
    change_password: "change your password",
    forgot_password: "reset your password",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a1a1a;">Hi ${firstName},</h2>
      <p>Use the code below to ${actions[purpose]}:</p>

      <div style="
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 12px;
        color: #4F46E5;
        padding: 20px;
        background: #F5F3FF;
        border-radius: 8px;
        text-align: center;
        margin: 24px 0;
      ">
        ${otp}
      </div>

      <p style="color: #666;">This code expires in <strong>5 minutes</strong>.</p>
      <p style="color: #666;">If you didn't request this, ignore this email.</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999;">Restaurant SaaS Platform</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Restaurant SaaS" <${process.env.EMAIL_USER}>`,
      to,
      subject: subjects[purpose] || "Your verification code",
      html,
    });
    logger.info(`[Mailer] OTP email sent → ${to} [${purpose}]`);
  } catch (err) {
    logger.error(`[Mailer] Failed to send OTP email → ${to}:`, err.message);
    throw err;
  }
};

module.exports = sendOtpEmail;
