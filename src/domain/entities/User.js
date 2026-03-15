"use strict";

const UserRole = require("../enums/UserRole");
const UserStatus = require("../enums/UserStatus");

class User {
  constructor({
    id,
    firstName,
    lastName,
    email,
    phone = null,
    passwordHash,
    primaryRole = UserRole.STAFF,
    restaurantId = null,
    branchId = null,
    status = UserStatus.PENDING,
    isEmailVerified = false,
    lastLoginAt = null,
    deletedAt = null,
    createdAt,
    updatedAt,
    roles = [],
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email.toLowerCase().trim();
    this.phone = phone ?? null;
    this.passwordHash = passwordHash;
    this.primaryRole = primaryRole;
    this.restaurantId = restaurantId;
    this.branchId = branchId;
    this.status = status;
    this.isEmailVerified = isEmailVerified;
    this.lastLoginAt = lastLoginAt;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.roles = roles;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive() {
    return this.status === UserStatus.ACTIVE;
  }
  isDeleted() {
    return this.deletedAt !== null;
  }

  isSuperAdmin() {
    return this.primaryRole === UserRole.SUPER_ADMIN;
  }

  isAdmin() {
    return this.primaryRole === UserRole.ADMIN;
  }

  isAdminOf(restaurantId) {
    return (
      this.primaryRole === UserRole.ADMIN && this.restaurantId === restaurantId
    );
  }

  isManagerOf(branchId) {
    return this.primaryRole === UserRole.MANAGER && this.branchId === branchId;
  }

  hasRoleInBranch(branchId) {
    return this.branchId === branchId;
  }

  hasRoleInRestaurant(restaurantId) {
    return this.restaurantId === restaurantId;
  }

  creatableRoles() {
    if (this.isSuperAdmin()) return Object.values(UserRole);
    if (this.isAdmin())
      return [
        UserRole.MANAGER,
        UserRole.STAFF,
        UserRole.CHEF,
        UserRole.DELIVERY,
      ];
    return [];
  }

  toTokenPayload() {
    return {
      sub: this.id,
      primaryRole: this.primaryRole,
      restaurantId: this.restaurantId,
      branchId: this.branchId,
      roles: this.roles.map((r) => r.role),
    };
  }

  toPublicJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      primaryRole: this.primaryRole,
      restaurantId: this.restaurantId,
      branchId: this.branchId,
      status: this.status,
      isEmailVerified: this.isEmailVerified,
      lastLoginAt: this.lastLoginAt,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      roles: this.roles.map((r) => (r.toPublicJSON ? r.toPublicJSON() : r)),
    };
  }
}

module.exports = User;
