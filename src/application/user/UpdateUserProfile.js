"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const UserRole = require("../../domain/enums/UserRole");

const ROLE_RANK = {
  [UserRole.SUPERADMIN]: 4,
  [UserRole.ADMIN]: 3,
  [UserRole.MANAGER]: 2,
  [UserRole.STAFF]: 1,
};

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

    if (!actor.isSuperAdmin()) {
      if (!isSelf) {
        if (actor.restaurantId !== target.restaurantId) {
          throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
        }
        if (ROLE_RANK[target.role] >= ROLE_RANK[actor.role]) {
          throw new AppError(
            "You cannot update a user with equal or higher role.",
            403,
            CODES.FORBIDDEN,
          );
        }
      }
    }

    const allowedFields = ["firstName", "lastName", "phone"];
    const privilegedFields = ["role", "status"];

    const sanitized = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) sanitized[field] = updates[field];
    }

    if (actor.isAdmin() || actor.isSuperAdmin()) {
      for (const field of privilegedFields) {
        if (updates[field] !== undefined) {
          if (field === "role") {
            if (
              !actor.isSuperAdmin() &&
              ROLE_RANK[updates.role] >= ROLE_RANK[actor.role]
            ) {
              throw new AppError(
                "You cannot assign a role equal to or higher than your own.",
                403,
                CODES.FORBIDDEN,
              );
            }
          }

          sanitized[field] = updates[field];
        }
      }
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
