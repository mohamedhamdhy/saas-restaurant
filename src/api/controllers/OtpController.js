"use strict";

class OtpController {
  constructor({
    sendOtp,
    verifyRegistrationOtp,
    verifyLoginOtp,
    requestChangePasswordOtp,
    changePasswordWithOtp,
    forgotPassword,
    resetPassword,
  }) {
    this.sendOtp = sendOtp;
    this.verifyRegistrationOtp = verifyRegistrationOtp;
    this.verifyLoginOtp = verifyLoginOtp;
    this.requestChangePasswordOtp = requestChangePasswordOtp;
    this.changePasswordWithOtp = changePasswordWithOtp;
    this.forgotPassword = forgotPassword;
    this.resetPassword = resetPassword;

    this.handleResendOtp = this.handleResendOtp.bind(this);
    this.handleVerifyRegistration = this.handleVerifyRegistration.bind(this);
    this.handleVerifyLogin = this.handleVerifyLogin.bind(this);
    this.handleRequestChangePassword =
      this.handleRequestChangePassword.bind(this);
    this.handleChangePasswordWithOtp =
      this.handleChangePasswordWithOtp.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
  }

  async handleResendOtp(req, res, next) {
    try {
      const { userId, purpose } = req.body;
      const result = await this.sendOtp.execute(userId, purpose);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleVerifyRegistration(req, res, next) {
    try {
      const result = await this.verifyRegistrationOtp.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleVerifyLogin(req, res, next) {
    try {
      const result = await this.verifyLoginOtp.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleRequestChangePassword(req, res, next) {
    try {
      const result = await this.requestChangePasswordOtp.execute(req.actor);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleChangePasswordWithOtp(req, res, next) {
    try {
      const result = await this.changePasswordWithOtp.execute({
        userId: req.actor.id,
        otp: req.body.otp,
        newPassword: req.body.newPassword,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleForgotPassword(req, res, next) {
    try {
      const result = await this.forgotPassword.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleResetPassword(req, res, next) {
    try {
      const result = await this.resetPassword.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OtpController;
