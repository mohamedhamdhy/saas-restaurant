"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class ListBranches {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(
    actor,
    { restaurantId, status, city, page = 1, limit = 20 } = {},
  ) {
    let scopedRestaurantId;

    if (actor.isSuperAdmin()) {
      if (!restaurantId) {
        throw new AppError(
          "restaurantId is required for listing branches.",
          400,
          CODES.VALIDATION_ERROR,
        );
      }
      scopedRestaurantId = restaurantId;
    } else {
      scopedRestaurantId = actor.restaurantId;
    }

    const offset = (page - 1) * limit;
    const result = await this.branchRepository.findAllByRestaurant(
      scopedRestaurantId,
      { status, city, limit, offset },
    );

    return {
      total: result.total,
      page,
      limit,
      branches: result.branches.map((b) => b.toPublicJSON()),
    };
  }
}

module.exports = ListBranches;
