"use strict";

const twilio = require("twilio");
const logger = require("../../shared/utils/Logger");

let client;

const getSmsClient = () => {
  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    logger.info("[SMS] ✓ Twilio client initialized");
  }
  return client;
};

module.exports = { getSmsClient };
