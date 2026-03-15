"use strict";

const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const {
  validate,
  verifyRegistrationSchema,
  verifyLoginSchema,
  changePasswordWithOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendOtpSchema,
} = require("../validators/OtpValidator");

const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    code: "TOO_MANY_REQUESTS",
    message: "Too many OTP requests. Please wait 15 minutes.",
  },
});

const otpRoutes = (controller, authenticate) => {
  const router = Router();

  router.use(otpLimiter);

  router.post(
    "/otp/verify/registration",
    validate(verifyRegistrationSchema),
    controller.handleVerifyRegistration,
  );

  router.post(
    "/otp/verify/login",
    validate(verifyLoginSchema),
    controller.handleVerifyLogin,
  );

  router.post(
    "/otp/resend",
    validate(resendOtpSchema),
    controller.handleResendOtp,
  );

  router.post(
    "/otp/forgot-password",
    validate(forgotPasswordSchema),
    controller.handleForgotPassword,
  );

  router.post(
    "/otp/reset-password",
    validate(resetPasswordSchema),
    controller.handleResetPassword,
  );

  router.post(
    "/otp/change-password/request",
    authenticate,
    controller.handleRequestChangePassword,
  );

  router.post(
    "/otp/change-password/verify",
    authenticate,
    validate(changePasswordWithOtpSchema),
    controller.handleChangePasswordWithOtp,
  );

  return router;
};

module.exports = otpRoutes;
