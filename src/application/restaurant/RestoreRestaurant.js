"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class RestoreRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, { restaurantId }) {
    if (!actor.isSuperAdmin()) {
      throw new AppError(
        "Only super_admin can restore restaurants.",
        403,
        CODES.FORBIDDEN,
      );
    }

    const restored = await this.restaurantRepository.restore(restaurantId);
    if (!restored) {
      throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
    }

    return restored.toPublicJSON();
  }
}

module.exports = RestoreRestaurant;
