"use strict";

const UserRole = require("../enums/UserRole");
const UserStatus = require("../enums/UserStatus");

class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    phone,
    passwordHash,
    role = UserRole.STAFF,
    status = UserStatus.PENDING,
    restaurantId = null,
    isEmailVerified = false,
    lastLoginAt = null,
    createdAt,
    updatedAt,
  }) {
    if (role === UserRole.SUPERADMIN && restaurantId !== null) {
      throw new Error("super_admin must not be scoped to a restaurant.");
    }

    if (role !== UserRole.SUPERADMIN && !restaurantId) {
      throw new Error(`Role "${role}" must be assigned to a restaurant.`);
    }

    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email ? email.toLowerCase().trim() : null;
    this.phone = phone ?? null;
    this.passwordHash = passwordHash;
    this.role = role;
    this.status = status;
    this.restaurantId = restaurantId;
    this.isEmailVerified = isEmailVerified;
    this.lastLoginAt = lastLoginAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isSuperAdmin() {
    return this.role === UserRole.SUPERADMIN;
  }
  isAdmin() {
    return this.role === UserRole.ADMIN;
  }
  isManager() {
    return this.role === UserRole.MANAGER;
  }
  isStaff() {
    return this.role === UserRole.STAFF;
  }

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }
  isPending() {
    return this.status === UserStatus.PENDING;
  }

  isPlatformLevel() {
    return this.isSuperAdmin() && !this.restaurantId;
  }

  isRestaurantLevel() {
    return !!this.restaurantId;
  }

  creatableRoles() {
    if (this.isSuperAdmin()) {
      return Object.values(UserRole);
    }
    if (this.isAdmin()) {
      return [UserRole.MANAGER, UserRole.STAFF];
    }
    return [];
  }

  toPublicJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      status: this.status,
      restaurantId: this.restaurantId,
      isEmailVerified: this.isEmailVerified,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
