"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class UpdateUserProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(actor, { targetUserId, updates }) {
    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    const isSelf = actor.id === target.id;

    if (!actor.isSuperAdmin() && !isSelf) {
      const adminRole = actor.roles.find((r) => r.role === "admin");
      if (!adminRole) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }

      const targetInRestaurant = target.roles.some(
        (r) => r.restaurantId === adminRole.restaurantId,
      );
      if (!targetInRestaurant) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    }

    const allowedFields = ["firstName", "lastName", "phone", "status"];
    const sanitized = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) sanitized[field] = updates[field];
    }

    if (Object.keys(sanitized).length === 0) {
      throw new AppError(
        "No valid fields to update.",
        400,
        CODES.VALIDATION_ERROR,
      );
    }

    const updated = await this.userRepository.update(target.id, sanitized);
    return updated.toPublicJSON();
  }
}

module.exports = UpdateUserProfile;
