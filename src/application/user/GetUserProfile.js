"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const UserRole = require("../../domain/enums/UserRole");

class GetUserProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(actor, { targetUserId }) {
    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (actor.isSuperAdmin()) {
    } else if (actor.isAdmin() || actor.isManager()) {
      if (target.restaurantId !== actor.restaurantId) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    } else {
      if (target.id !== actor.id) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    }

    return target.toPublicJSON();
  }
}

module.exports = GetUserProfile;
