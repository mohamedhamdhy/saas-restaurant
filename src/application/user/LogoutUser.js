"use strict";

class LogoutUser {
  constructor({ tokenRepository }) {
    this.tokenRepository = tokenRepository;
  }

  async execute({ userId }) {
    await this.tokenRepository.revoke(userId);
    return { message: "Logged out successfully." };
  }
}

module.exports = LogoutUser;
