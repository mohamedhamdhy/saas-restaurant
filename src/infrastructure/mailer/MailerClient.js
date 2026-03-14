"use strict";

const nodemailer = require("nodemailer");
const logger = require("../../shared/utils/Logger");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) logger.error("[Mailer] SMTP connection failed:", err.message);
  else logger.info("[Mailer] ✓ SMTP ready");
});

module.exports = transporter;
