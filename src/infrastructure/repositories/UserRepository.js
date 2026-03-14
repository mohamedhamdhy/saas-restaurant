"use strict";

const IUserRepository = require("../../domain/interfaces/IUserRepository");
const User = require("../../domain/entities/User");
const UserModel = require("../database/models/UserModel");

class UserRepository extends IUserRepository {
  #toEntity(model) {
    if (!model) return null;
    return new User(model.toEntity());
  }

  async findById(id) {
    const row = await UserModel.findByPk(id);
    return this.#toEntity(row);
  }

  async findByEmail(email) {
    const row = await UserModel.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return this.#toEntity(row);
  }

  async findAllByRestaurant(
    restaurantId,
    { role, status, limit = 20, offset = 0 } = {},
  ) {
    const where = { restaurantId };
    if (role) where.role = role;
    if (status) where.status = status;

    const { rows, count } = await UserModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      users: rows.map((r) => this.#toEntity(r)),
    };
  }

  async findAll({ role, status, limit = 20, offset = 0 } = {}) {
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const { rows, count } = await UserModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      count,
      rows: rows.map((r) => this.#toEntity(r)),
    };
  }

  async findAllPlatformAdmins() {
    const { rows, count } = await UserModel.findAndCountAll({
      where: { restaurantId: null },
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      users: rows.map((r) => this.#toEntity(r)),
    };
  }

  async create(userEntity) {
    const row = await UserModel.create({
      id: userEntity.id,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      email: userEntity.email,
      phone: userEntity.phone,
      passwordHash: userEntity.passwordHash,
      role: userEntity.role,
      status: userEntity.status,
      restaurantId: userEntity.restaurantId,
      isEmailVerified: userEntity.isEmailVerified,
    });
    return this.#toEntity(row);
  }

  async update(id, fields) {
    const [affectedRows] = await UserModel.update(fields, {
      where: { id },
    });

    if (affectedRows === 0) return null;

    const updated = await UserModel.findByPk(id);
    return this.#toEntity(updated);
  }

  async delete(id) {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async updateLastLogin(id) {
    await UserModel.update({ lastLoginAt: new Date() }, { where: { id } });
  }

  async existsByEmail(email) {
    const count = await UserModel.count({
      where: { email: email.toLowerCase().trim() },
    });
    return count > 0;
  }
}

module.exports = UserRepository;
