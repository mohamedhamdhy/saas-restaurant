"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class UpdateBranch {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(actor, { branchId, updates }) {
    const branch = await this.branchRepository.findById(branchId);
    if (!branch) {
      throw new AppError("Branch not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (!actor.isSuperAdmin()) {
      if (branch.restaurantId !== actor.restaurantId) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
      if (actor.isStaff()) {
        throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
      }
    }

    const basicFields = [
      "name",
      "description",
      "phone",
      "email",
      "address",
      "city",
      "country",
      "latitude",
      "longitude",
      "businessHours",
    ];
    const privilegedFields = ["status"];

    const sanitized = {};

    for (const field of basicFields) {
      if (updates[field] !== undefined) sanitized[field] = updates[field];
    }

    if (actor.isSuperAdmin() || actor.isAdmin()) {
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

    const updated = await this.branchRepository.update(branchId, sanitized);
    return updated.toPublicJSON();
  }
}

module.exports = UpdateBranch;
