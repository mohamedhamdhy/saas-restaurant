"use strict";

class IOtpRepository {
  async save(key, otp, ttlSeconds) {
    throw new Error("Not implemented");
  }
  async find(key) {
    throw new Error("Not implemented");
  }
  async revoke(key) {
    throw new Error("Not implemented");
  }
  async incrementAttempts(key) {
    throw new Error("Not implemented");
  }
  async getAttempts(key) {
    throw new Error("Not implemented");
  }
}

module.exports = IOtpRepository;
