"use strict";

const IRestaurantRepository = require("../../domain/interfaces/IRestaurantRepository");
const Restaurant = require("../../domain/entities/Restaurant");
const RestaurantModel = require("../database/models/RestaurantModel");

class RestaurantRepository extends IRestaurantRepository {
  #toEntity(model) {
    if (!model) return null;
    return new Restaurant(model.toEntity());
  }

  async findById(id) {
    const row = await RestaurantModel.findByPk(id);
    return this.#toEntity(row);
  }

  async findAll({ status, limit = 20, offset = 0 } = {}) {
    const where = {};
    if (status) where.status = status;

    const { rows, count } = await RestaurantModel.findAndCountAll({
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

  async create(restaurantEntity) {
    const row = await RestaurantModel.create({
      id: restaurantEntity.id,
      name: restaurantEntity.name,
      description: restaurantEntity.description,
      logoUrl: restaurantEntity.logoUrl,
      phone: restaurantEntity.phone,
      email: restaurantEntity.email,
      website: restaurantEntity.website,
      status: restaurantEntity.status,
      ownerId: restaurantEntity.ownerId,
    });
    return this.#toEntity(row);
  }

  async update(id, fields) {
    const [affectedRows] = await RestaurantModel.update(fields, {
      where: { id },
    });

    if (affectedRows === 0) return null;

    const updated = await RestaurantModel.findByPk(id);
    return this.#toEntity(updated);
  }

  async delete(id) {
    const deleted = await RestaurantModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async hardDelete(id) {
    const deleted = await RestaurantModel.destroy({
      where: { id },
      force: true,
    });
    return deleted > 0;
  }

  async restore(id) {
    await RestaurantModel.restore({ where: { id } });
    const restored = await RestaurantModel.findByPk(id);
    return this.#toEntity(restored);
  }

  async existsByName(name) {
    const count = await RestaurantModel.count({
      where: { name: name.trim() },
    });
    return count > 0;
  }
}

module.exports = RestaurantRepository;
