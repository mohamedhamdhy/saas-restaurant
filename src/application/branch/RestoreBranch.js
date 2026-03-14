"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class RestoreBranch {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(actor, { branchId }) {
    if (!actor.isSuperAdmin() && !actor.isAdmin()) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    const restored = await this.branchRepository.restore(branchId);
    if (!restored) {
      throw new AppError("Branch not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (actor.isAdmin() && restored.restaurantId !== actor.restaurantId) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    return restored.toPublicJSON();
  }
}

module.exports = RestoreBranch;
