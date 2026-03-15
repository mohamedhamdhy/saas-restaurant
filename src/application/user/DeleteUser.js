"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class DeleteUser {
  constructor({ userRepository, userRoleRepository }) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
  }

  async execute(actor, { targetUserId }) {
    if (actor.id === targetUserId) {
      throw new AppError(
        "You cannot delete your own account.",
        400,
        CODES.FORBIDDEN,
      );
    }

    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (!actor.isSuperAdmin()) {
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

      const targetIsAdmin = target.roles.some((r) => r.role === "admin");
      if (targetIsAdmin) {
        throw new AppError(
          "You cannot delete another admin.",
          403,
          CODES.FORBIDDEN,
        );
      }
    }

    await this.userRoleRepository.revokeAll(targetUserId);
    await this.userRepository.delete(targetUserId);

    return { message: "User deleted successfully." };
  }
}

module.exports = DeleteUser;
