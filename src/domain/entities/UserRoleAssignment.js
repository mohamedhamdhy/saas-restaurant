"use strict";

class UserRoleAssignment {
  constructor({ id, userId, role, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.role = role;
    this.createdAt = createdAt;
  }

  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = UserRoleAssignment;
