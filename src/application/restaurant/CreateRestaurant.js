"use strict";

const { v4: uuidv4 } = require("uuid");
const Restaurant = require("../../domain/entities/Restaurant");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class CreateRestaurant {
  constructor({ restaurantRepository }) {
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, dto) {
    const {
      name,
      email,
      phone,
      address,
      city,
      country,
      description,
      logoUrl,
      website,
    } = dto;

    if (!actor.isSuperAdmin()) {
      throw new AppError(
        "Only superAdmin can create restaurants.",
        403,
        CODES.FORBIDDEN,
      );
    }

    const restaurant = new Restaurant({
      id: uuidv4(),
      name,
      email,
      phone: phone ?? null,
      address: address ?? null,
      city: city ?? null,
      country: country ?? null,
      description: description ?? null,
      logoUrl: logoUrl ?? null,
      website: website ?? null,
      ownerId: null,
    });

    const created = await this.restaurantRepository.create(restaurant);
    return created.toPublicJSON();
  }
}

module.exports = CreateRestaurant;
