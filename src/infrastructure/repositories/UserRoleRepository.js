"use strict";

const IUserRoleRepository = require("../../domain/interfaces/IUserRoleRepository");
const UserRoleModel = require("../database/models/UserRoleModel");
const UserModel = require("../database/models/UserModel");

class UserRoleRepository extends IUserRoleRepository {
  async assign(assignment) {
    const row = await UserRoleModel.create({
      id: assignment.id,
      userId: assignment.userId,
      role: assignment.role,
    });
    return row.toEntity();
  }

  async revoke(userId, role) {
    const deleted = await UserRoleModel.destroy({
      where: { userId, role },
    });
    return deleted > 0;
  }

  async revokeAll(userId) {
    await UserRoleModel.destroy({ where: { userId } });
  }

  async findByUser(userId) {
    const rows = await UserRoleModel.findAll({ where: { userId } });
    return rows.map((r) => r.toEntity());
  }

  async existsAdminInRestaurant(restaurantId) {
    const count = await UserModel.count({
      where: {
        restaurantId,
        primaryRole: "admin",
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsManagerInBranch(branchId) {
    const count = await UserModel.count({
      where: {
        branchId,
        primaryRole: "manager",
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async countByBranchAndRole(branchId, role) {
    return UserModel.count({
      where: { branchId, primaryRole: role, deletedAt: null },
    });
  }

  async findByRestaurant(restaurantId, { role } = {}) {
    const where = { restaurantId };
    if (role) where.primaryRole = role;
    const rows = await UserModel.findAll({ where });
    return rows;
  }

  async findByBranch(branchId, { role } = {}) {
    const where = { branchId };
    if (role) where.primaryRole = role;
    const rows = await UserModel.findAll({ where });
    return rows;
  }
}

module.exports = UserRoleRepository;
