"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class ListRestaurants {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, { status, page = 1, limit = 20 } = {}) {
    if (!actor.isSuperAdmin() && !actor.isAdmin()) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    if (actor.isAdmin()) {
      const restaurant = await this.restaurantRepository.findById(
        actor.restaurantId,
      );
      if (!restaurant) {
        throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
      }
      return {
        total: 1,
        page: 1,
        limit,
        restaurants: [restaurant.toPublicJSON()],
      };
    }

    const offset = (page - 1) * limit;
    const result = await this.restaurantRepository.findAll({
      status,
      limit,
      offset,
    });

    return {
      total: result.count,
      page,
      limit,
      restaurants: result.rows.map((r) => r.toPublicJSON()),
    };
  }
}

module.exports = ListRestaurants;
