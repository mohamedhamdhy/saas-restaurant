"use strict";

class IUserRepository {
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findByEmail(email) {
    throw new Error("Not implemented");
  }
  async findAllByRestaurant(restaurantId, filters) {
    throw new Error("Not implemented");
  }
  async create(userEntity) {
    throw new Error("Not implemented");
  }
  async update(id, fields) {
    throw new Error("Not implemented");
  }
  async delete(id) {
    throw new Error("Not implemented");
  }
  async updateLastLogin(id) {
    throw new Error("Not implemented");
  }
  async existsByEmail(email) {
    throw new Error("Not implemented");
  }
}

module.exports = IUserRepository;
