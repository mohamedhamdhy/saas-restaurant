"use strict";

const BranchStatus = require("../enums/BranchStatus");

class Branch {
  constructor({
    id,
    restaurantId,
    name,
    description = null,
    phone = null,
    email = null,
    address,
    city,
    country,
    latitude = null,
    longitude = null,
    businessHours = null,
    status = BranchStatus.ACTIVE,
    deletedAt = null,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.restaurantId = restaurantId;
    this.name = name.trim();
    this.description = description;

    this.phone = phone ?? null;
    this.email = email ? email.toLowerCase().trim() : null;

    this.address = address;
    this.city = city;
    this.country = country;
    this.latitude = latitude ?? null;
    this.longitude = longitude ?? null;

    this.businessHours = businessHours ?? this.#defaultBusinessHours();

    this.status = status;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  #defaultBusinessHours() {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const hours = {};
    days.forEach((day) => {
      hours[day] = { open: "09:00", close: "22:00", isClosed: false };
    });
    return hours;
  }

  isActive() {
    return this.status === BranchStatus.ACTIVE;
  }
  isDeleted() {
    return this.deletedAt !== null;
  }

  isOpenOn(day) {
    const hours = this.businessHours?.[day.toLowerCase()];
    return hours ? !hours.isClosed : false;
  }

  toPublicJSON() {
    return {
      id: this.id,
      restaurantId: this.restaurantId,
      name: this.name,
      description: this.description,
      phone: this.phone,
      email: this.email,
      address: this.address,
      city: this.city,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude,
      businessHours: this.businessHours,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Branch;
