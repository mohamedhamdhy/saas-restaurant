"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const RestaurantStatus = require("../../domain/enums/RestaurantStatus");

class UpdateRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, { restaurantId, updates }) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (!actor.isSuperAdmin()) {
      if (actor.restaurantId !== restaurantId) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    }

    const allowedFields = [
      "name",
      "description",
      "logoUrl",
      "phone",
      "email",
      "website",
    ];
    const privilegedFields = ["status"];

    const sanitized = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) sanitized[field] = updates[field];
    }

    if (actor.isSuperAdmin()) {
      for (const field of privilegedFields) {
        if (updates[field] !== undefined) sanitized[field] = updates[field];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      throw new AppError(
        "No valid fields to update.",
        400,
        CODES.VALIDATION_ERROR,
      );
    }

    const updated = await this.restaurantRepository.update(
      restaurantId,
      sanitized,
    );
    return updated.toPublicJSON();
  }
}

module.exports = UpdateRestaurant;
