"use strict";

const { v4: uuidv4 } = require("uuid");
const Branch = require("../../domain/entities/Branch");
const BranchStatus = require("../../domain/enums/BranchStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class CreateBranch {
  constructor({ branchRepository, restaurantRepository }) {
    this.branchRepository = branchRepository;
    this.restaurantRepository = restaurantRepository;
  }

  async execute(actor, dto) {
    const {
      restaurantId,
      name,
      description,
      phone,
      email,
      address,
      city,
      country,
      latitude,
      longitude,
      businessHours,
    } = dto;

    if (!actor.isSuperAdmin() && !actor.isAdmin()) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    if (actor.isAdmin() && actor.restaurantId !== restaurantId) {
      throw new AppError(
        "You can only create branches for your own restaurant.",
        403,
        CODES.FORBIDDEN,
      );
    }

    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
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
      status: BranchStatus.ACTIVE,
    });

    const created = await this.branchRepository.create(branch);
    return created.toPublicJSON();
  }
}

module.exports = CreateBranch;
