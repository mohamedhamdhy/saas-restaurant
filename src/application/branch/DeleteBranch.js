"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class DeleteBranch {
  constructor({ branchRepository }) {
    this.branchRepository = branchRepository;
  }

  async execute(actor, { branchId, force = false }) {
    if (!actor.isSuperAdmin() && !actor.isAdmin()) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    const branch = await this.branchRepository.findById(branchId);
    if (!branch) {
      throw new AppError("Branch not found.", 404, CODES.USER_NOT_FOUND);
    }

    if (actor.isAdmin() && branch.restaurantId !== actor.restaurantId) {
      throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
    }

    if (force) {
      await this.branchRepository.hardDelete(branchId);
      return { message: "Branch permanently deleted." };
    }

    await this.branchRepository.delete(branchId);
    return { message: "Branch deleted." };
  }
}

module.exports = DeleteBranch;
