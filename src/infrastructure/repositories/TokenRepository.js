"use strict";

const ITokenRepository = require("../../domain/interfaces/ITokenRepository");
const redisClient = require("../cache/RedisClient");

const key = (userId) => `refresh_token:${userId}`;

class TokenRepository extends ITokenRepository {
  async save(userId, refreshToken, ttlSeconds) {
    await redisClient.setex(key(userId), ttlSeconds, refreshToken);
  }

  async find(userId) {
    return redisClient.get(key(userId));
  }

  async revoke(userId) {
    await redisClient.del(key(userId));
  }

  async revokeAll(userId) {
    await redisClient.del(key(userId));
  }
}

module.exports = TokenRepository;
