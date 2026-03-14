"use strict";

class IRestaurantRepository {
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findAll(filters) {
    throw new Error("Not implemented");
  }
  async create(restaurantEntity) {
    throw new Error("Not implemented");
  }
  async update(id, fields) {
    throw new Error("Not implemented");
  }
  async delete(id) {
    throw new Error("Not implemented");
  }
  async restore(id) {
    throw new Error("Not implemented");
  }
  async existsByName(name) {
    throw new Error("Not implemented");
  }
}

module.exports = IRestaurantRepository;
