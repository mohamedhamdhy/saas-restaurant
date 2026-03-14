"use strict";

const Joi = require("joi");
const { validate } = require("./UserValidator");

const otp = Joi.string()
  .length(6)
  .pattern(/^\d{6}$/)
  .required()
  .messages({ "string.length": "OTP must be exactly 6 digits." });

const verifyRegistrationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  otp,
});

const verifyLoginSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  otp,
});

const requestChangePasswordSchema = Joi.object({});

const changePasswordWithOtpSchema = Joi.object({
  otp,
  newPassword: Joi.string().min(8).max(72).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  otp,
  newPassword: Joi.string().min(8).max(72).required(),
});

const resendOtpSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  purpose: Joi.string()
    .valid("registration", "login", "change_password", "forgot_password")
    .required(),
});

module.exports = {
  validate,
  verifyRegistrationSchema,
  verifyLoginSchema,
  requestChangePasswordSchema,
  changePasswordWithOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema,
};
