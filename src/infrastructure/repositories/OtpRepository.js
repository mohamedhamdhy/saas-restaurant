"use strict";

const IOtpRepository = require("../../domain/interfaces/IOtpRepository");
const redisClient = require("../cache/RedisClient");
const { OTP_TTL_SECONDS } = require("../../shared/utils/OtpUtils");

class OtpRepository extends IOtpRepository {
  async save(key, hashedOtp, ttlSeconds = OTP_TTL_SECONDS) {
    await redisClient.setex(key, ttlSeconds, hashedOtp);
  }

  async find(key) {
    return redisClient.get(key);
  }

  async revoke(key) {
    await redisClient.del(key);
  }

  async incrementAttempts(attemptKey, ttlSeconds = OTP_TTL_SECONDS) {
    const count = await redisClient.incr(attemptKey);
    if (count === 1) {
      await redisClient.expire(attemptKey, ttlSeconds);
    }
    return count;
  }

  async getAttempts(attemptKey) {
    const val = await redisClient.get(attemptKey);
    return val ? parseInt(val, 10) : 0;
  }
}

module.exports = OtpRepository;
