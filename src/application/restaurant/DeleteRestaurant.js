"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class DeleteRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, { restaurantId, force = false }) {
    if (!actor.isSuperAdmin()) {
      throw new AppError(
        "Only super_admin can delete restaurants.",
        403,
        CODES.FORBIDDEN,
      );
    }

    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (force) {
      await this.restaurantRepository.hardDelete(restaurantId);
      return { message: "Restaurant permanently deleted." };
    }

    await this.restaurantRepository.delete(restaurantId);
    return { message: "Restaurant deleted." };
  }
}

module.exports = DeleteRestaurant;
