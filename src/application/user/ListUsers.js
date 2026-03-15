"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");

class ListUsers {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(
    actor,
    { restaurantId, branchId, role, status, page = 1, limit = 20 } = {},
  ) {
    const offset = (page - 1) * limit;

    if (actor.isSuperAdmin()) {
      if (branchId) {
        const result = await this.userRepository.findAllByBranch(branchId, {
          role,
          status,
          limit,
          offset,
        });
        return {
          total: result.count,
          page,
          limit,
          users: result.rows.map((u) => u.toPublicJSON()),
        };
      }

      if (restaurantId) {
        const result = await this.userRepository.findAllByRestaurant(
          restaurantId,
          { status, limit, offset },
        );
        return {
          total: result.count,
          page,
          limit,
          users: result.rows.map((u) => u.toPublicJSON()),
        };
      }

      const result = await this.userRepository.findAll({
        status,
        limit,
        offset,
      });
      return {
        total: result.count,
        page,
        limit,
        users: result.rows.map((u) => u.toPublicJSON()),
      };
    }

    const adminRole = actor.roles.find((r) => r.role === "admin");
    if (adminRole) {
      const scopedRestaurantId = restaurantId || adminRole.restaurantId;
      if (branchId) {
        const result = await this.userRepository.findAllByBranch(branchId, {
          role,
          status,
          limit,
          offset,
        });
        return {
          total: result.count,
          page,
          limit,
          users: result.rows.map((u) => u.toPublicJSON()),
        };
      }
      const result = await this.userRepository.findAllByRestaurant(
        scopedRestaurantId,
        { status, limit, offset },
      );
      return {
        total: result.count,
        page,
        limit,
        users: result.rows.map((u) => u.toPublicJSON()),
      };
    }

    const managerRole = actor.roles.find((r) => r.role === "manager");
    if (managerRole) {
      const scopedBranchId = branchId || managerRole.branchId;
      const result = await this.userRepository.findAllByBranch(scopedBranchId, {
        role,
        status,
        limit,
        offset,
      });
      return {
        total: result.count,
        page,
        limit,
        users: result.rows.map((u) => u.toPublicJSON()),
      };
    }

    throw new AppError("Access denied.", 403, CODES.FORBIDDEN);
  }
}

module.exports = ListUsers;
