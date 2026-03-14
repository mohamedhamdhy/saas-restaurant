"use strict";

const IBranchRepository = require("../../domain/interfaces/IBranchRepository");
const Branch = require("../../domain/entities/Branch");
const BranchModel = require("../database/models/BranchModel");

class BranchRepository extends IBranchRepository {
  #toEntity(model) {
    if (!model) return null;
    return new Branch(model.toEntity());
  }

  async findById(id) {
    const row = await BranchModel.findByPk(id);
    return this.#toEntity(row);
  }

  async findAllByRestaurant(
    restaurantId,
    { status, city, limit = 20, offset = 0 } = {},
  ) {
    const where = { restaurantId };
    if (status) where.status = status;
    if (city) where.city = city;

    const { rows, count } = await BranchModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      branches: rows.map((r) => this.#toEntity(r)),
    };
  }

  async create(branchEntity) {
    const row = await BranchModel.create({
      id: branchEntity.id,
      restaurantId: branchEntity.restaurantId,
      name: branchEntity.name,
      description: branchEntity.description,
      phone: branchEntity.phone,
      email: branchEntity.email,
      address: branchEntity.address,
      city: branchEntity.city,
      country: branchEntity.country,
      latitude: branchEntity.latitude,
      longitude: branchEntity.longitude,
      businessHours: branchEntity.businessHours,
      status: branchEntity.status,
    });
    return this.#toEntity(row);
  }

  async update(id, fields) {
    const [affectedRows] = await BranchModel.update(fields, {
      where: { id },
    });

    if (affectedRows === 0) return null;

    const updated = await BranchModel.findByPk(id);
    return this.#toEntity(updated);
  }

  async delete(id) {
    const deleted = await BranchModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async hardDelete(id) {
    const deleted = await BranchModel.destroy({
      where: { id },
      force: true,
    });
    return deleted > 0;
  }

  async restore(id) {
    await BranchModel.restore({ where: { id } });
    const restored = await BranchModel.findByPk(id);
    return this.#toEntity(restored);
  }

  async countByRestaurant(restaurantId) {
    return BranchModel.count({ where: { restaurantId } });
  }
}

module.exports = BranchRepository;
