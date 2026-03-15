"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class GetUserProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(actor, { targetUserId }) {
    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new AppError("User not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (actor.isSuperAdmin()) return target.toPublicJSON();

    const actorRestaurantIds = actor.roles
      .filter((r) => r.restaurantId)
      .map((r) => r.restaurantId);

    const targetRestaurantIds = target.roles
      .filter((r) => r.restaurantId)
      .map((r) => r.restaurantId);

    const sharedRestaurant = actorRestaurantIds.some((id) =>
      targetRestaurantIds.includes(id),
    );

    if (actor.id === target.id) return target.toPublicJSON();

    if (sharedRestaurant) return target.toPublicJSON();

    throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
  }
}

module.exports = GetUserProfile;
