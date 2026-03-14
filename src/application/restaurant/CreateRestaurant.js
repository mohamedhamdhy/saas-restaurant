"use strict";

const { v4: uuidv4 } = require("uuid");
const Restaurant = require("../../domain/entities/Restaurant");
const RestaurantStatus = require("../../domain/enums/RestaurantStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class CreateRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  /**
   * @param {User}   actor
   * @param {object} dto  { name, description?, logoUrl?, phone?, email?, website? }
   */
  async execute(actor, dto) {
    if (!actor.isSuperAdmin()) {
      throw new AppError(
        "Only super_admin can create restaurants.",
        403,
        CODES.FORBIDDEN,
      );
    }

    const exists = await this.restaurantRepository.existsByName(dto.name);
    if (exists) {
      throw new AppError(
        `Restaurant "${dto.name}" already exists.`,
        409,
        CODES.USER_ALREADY_EXISTS,
      );
    }

    const restaurant = new Restaurant({
      id: uuidv4(),
      name: dto.name,
      description: dto.description ?? null,
      logoUrl: dto.logoUrl ?? null,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      website: dto.website ?? null,
      status: RestaurantStatus.PENDING_APPROVAL,
      ownerId: actor.id,
    });

    const created = await this.restaurantRepository.create(restaurant);
    return created.toPublicJSON();
  }
}

module.exports = CreateRestaurant;
