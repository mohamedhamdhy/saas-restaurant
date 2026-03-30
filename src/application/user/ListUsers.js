"use strict";

const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/errorCodes");

class ListUsers {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(
    actor,
    { restaurantId, branchId, role, status, page = 1, limit = 20 } = {},
  ) {
    const offset = (page - 1) * limit;

    // ── superAdmin → sees everything ───────────────────
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

    // ── admin → scoped to their restaurant ─────────────
    // restaurantId is now directly on actor, not in roles[]
    if (actor.primaryRole === "admin" && actor.restaurantId) {
      const scopedRestaurantId = restaurantId || actor.restaurantId;

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

    // ── manager → scoped to their branch ───────────────
    if (actor.primaryRole === "manager" && actor.branchId) {
      const scopedBranchId = branchId || actor.branchId;
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
