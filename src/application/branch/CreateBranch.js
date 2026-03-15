"use strict";

const { v4: uuidv4 } = require("uuid");
const Branch = require("../../domain/entities/Branch");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class CreateBranch {
  constructor({ branchRepository, restaurantRepository }) {
    this.branchRepository = branchRepository;
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, dto) {
    const {
      name,
      restaurantId,
      phone,
      email,
      address,
      city,
      country,
      description,
      latitude,
      longitude,
      businessHours,
    } = dto;

    if (!actor.isSuperAdmin()) {
      const isAdmin = actor.isAdminOf(restaurantId);
      if (!isAdmin) {
        throw new AppError(
          "Only superAdmin or the restaurant admin can create branches.",
          403,
          CODES.FORBIDDEN,
        );
      }
    }

    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError(
        "Restaurant not found. Create the restaurant first.",
        404,
        CODES.USER_NOT_FOUND,
      );
    }

    const branch = new Branch({
      id: uuidv4(),
      restaurantId,
      name,
      description: description ?? null,
      phone: phone ?? null,
      email: email ?? null,
      address,
      city,
      country,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      businessHours: businessHours ?? null,
    });

    const created = await this.branchRepository.create(branch);
    return created.toPublicJSON();
  }
}

module.exports = CreateBranch;
