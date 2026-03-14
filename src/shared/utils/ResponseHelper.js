"use strict";

const sendSuccess = (res, data = null, statusCode = 200, meta = null) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendError = (res, message, statusCode = 500, code = "INTERNAL_ERROR") => {
  return res.status(statusCode).json({ success: false, code, message });
};

module.exports = { sendSuccess, sendError };
