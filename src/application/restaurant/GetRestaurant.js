"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class GetRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, { restaurantId }) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (!actor.isSuperAdmin()) {
      if (actor.restaurantId !== restaurantId) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    }

    return restaurant.toPublicJSON();
  }
}

module.exports = GetRestaurant;
