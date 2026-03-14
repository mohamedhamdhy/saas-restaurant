"use strict";

class ITokenRepository {
  async save(userId, refreshToken, ttlSeconds) {
    throw new Error("Not implemented");
  }
  async find(userId) {
    throw new Error("Not implemented");
  }
  async revoke(userId) {
    throw new Error("Not implemented");
  }
  async revokeAll(userId) {
    throw new Error("Not implemented");
  }
}

module.exports = ITokenRepository;
