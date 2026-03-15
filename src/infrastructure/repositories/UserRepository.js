'use strict';

const IUserRepository              = require('../../domain/interfaces/IUserRepository');
const { UserModel, UserRoleModel } = require('../database/models/Index');

const WITH_ROLES = {
  include: [{
    model: UserRoleModel,
    as:    'UserRoles',
  }],
};

class UserRepository extends IUserRepository {

  #toEntity(model) {
    if (!model) return null;
    return model.toEntity();
  }

  async findById(id) {
    const row = await UserModel.findByPk(id, WITH_ROLES);
    return this.#toEntity(row);
  }

  async findByEmail(email) {
    const row = await UserModel.findOne({
      where: { email: email.toLowerCase().trim() },
      ...WITH_ROLES,
    });
    return this.#toEntity(row);
  }

  async findAll({ status, limit = 20, offset = 0 } = {}) {
    const where = {};
    if (status) where.status = status;

    const { rows, count } = await UserModel.findAndCountAll({
      where,
      limit,
      offset,
      order:    [['createdAt', 'DESC']],
      ...WITH_ROLES,
      distinct: true,
    });

    return { count, rows: rows.map((r) => this.#toEntity(r)) };
  }

  async findAllByRestaurant(restaurantId, { status, limit = 20, offset = 0 } = {}) {
    const where = { restaurantId };
    if (status) where.status = status;

    const { rows, count } = await UserModel.findAndCountAll({
      where,
      limit,
      offset,
      order:    [['createdAt', 'DESC']],
      ...WITH_ROLES,
      distinct: true,
    });

    return { count, rows: rows.map((r) => this.#toEntity(r)) };
  }

  async findAllByBranch(branchId, { status, role, limit = 20, offset = 0 } = {}) {
    const where = { branchId };
    if (status)      where.status      = status;
    if (role)        where.primaryRole = role;

    const { rows, count } = await UserModel.findAndCountAll({
      where,
      limit,
      offset,
      order:    [['createdAt', 'DESC']],
      ...WITH_ROLES,
      distinct: true,
    });

    return { count, rows: rows.map((r) => this.#toEntity(r)) };
  }

  async create(userEntity) {
    const row = await UserModel.create({
      id:              userEntity.id,
      firstName:       userEntity.firstName,
      lastName:        userEntity.lastName,
      email:           userEntity.email,
      phone:           userEntity.phone,
      passwordHash:    userEntity.passwordHash,
      primaryRole:     userEntity.primaryRole,
      restaurantId:    userEntity.restaurantId,
      branchId:        userEntity.branchId,
      status:          userEntity.status,
      isEmailVerified: userEntity.isEmailVerified,
    });
    return this.findById(row.id);
  }

  async update(id, fields) {
    const allowed = [
      'firstName', 'lastName', 'phone',
      'primaryRole', 'restaurantId', 'branchId',
      'status', 'isEmailVerified', 'passwordHash',
    ];
    const updates = {};
    for (const key of allowed) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }

    const [affected] = await UserModel.update(updates, { where: { id } });
    if (affected === 0) return null;
    return this.findById(id);
  }

  async delete(id) {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async hardDelete(id) {
    const deleted = await UserModel.destroy({ where: { id }, force: true });
    return deleted > 0;
  }

  async restore(id) {
    await UserModel.restore({ where: { id } });
    return this.findById(id);
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