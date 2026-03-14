"use strict";

const RestaurantStatus = require("../enums/RestaurantStatus");

class Restaurant {
  constructor({
    id,
    name,
    description = null,
    logoUrl = null,
    phone = null,
    email = null,
    website = null,
    status = RestaurantStatus.PENDING_APPROVAL,
    ownerId,
    deletedAt = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name.trim();
    this.description = description;
    this.logoUrl = logoUrl;
    this.phone = phone ?? null;
    this.email = email ? email.toLowerCase().trim() : null;
    this.website = website ?? null;
    this.status = status;
    this.ownerId = ownerId;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive() {
    return this.status === RestaurantStatus.ACTIVE;
  }
  isDeleted() {
    return this.deletedAt !== null;
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      logoUrl: this.logoUrl,
      phone: this.phone,
      email: this.email,
      website: this.website,
      status: this.status,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Restaurant;
