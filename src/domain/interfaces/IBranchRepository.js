"use strict";

class IBranchRepository {
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findAllByRestaurant(restaurantId, filters) {
    throw new Error("Not implemented");
  }
  async create(branchEntity) {
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
  async countByRestaurant(restaurantId) {
    throw new Error("Not implemented");
  }
}

module.exports = IBranchRepository;
