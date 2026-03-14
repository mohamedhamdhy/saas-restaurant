"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const {
  comparePassword,
  hashPassword,
} = require("../../shared/utils/passwordUtils");

class ChangePassword {
  constructor({ userRepository, tokenRepository }) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  async execute({ userId, oldPassword, newPassword }) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    await comparePassword(oldPassword, user.passwordHash);

    const newHash = await hashPassword(newPassword);
    await this.userRepository.update(userId, { passwordHash: newHash });

    await this.tokenRepository.revokeAll(userId);

    return { message: "Password changed. Please log in again." };
  }
}

module.exports = ChangePassword;
