"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class GetBranch {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(actor, { branchId }) {
    const branch = await this.branchRepository.findById(branchId);
    if (!branch) {
      throw new AppError("Branch not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (!actor.isSuperAdmin()) {
      if (actor.isAdmin()) {
        if (branch.restaurantId !== actor.restaurantId) {
          throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
        }
      } else {
        if (branch.restaurantId !== actor.restaurantId) {
          throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
        }
      }
    }

    return branch.toPublicJSON();
  }
}

module.exports = GetBranch;
