"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class ListUsers {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(
    actor,
    { restaurantId, role, status, page = 1, limit = 20 } = {},
  ) {
    if (!actor.isSuperAdmin() && !actor.isAdmin()) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    const offset = (page - 1) * limit;

    if (actor.isSuperAdmin() && !restaurantId) {
      const result = await this.userRepository.findAll({
        role,
        status,
        limit,
        offset,
      });

      return {
        total: result.count,
        page,
        limit,
        users: result.rows.map((u) => u.toPublicJSON()),
      };
    }

    const scopedRestaurantId = actor.isSuperAdmin()
      ? restaurantId
      : actor.restaurantId;

    const result = await this.userRepository.findAllByRestaurant(
      scopedRestaurantId,
      { role, status, limit, offset },
    );

    return {
      total: result.total,
      page,
      limit,
      users: result.users.map((u) => u.toPublicJSON()),
    };
  }
}

module.exports = ListUsers;
