"use strict";

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../Connection");
const UserStatus = require("../../../domain/enums/UserStatus");
const UserRole = require("../../../domain/enums/UserRole");
const User = require("../../../domain/entities/User");

class UserModel extends Model {
  toEntity() {
    const roles = this.UserRoles ? this.UserRoles.map((r) => r.toEntity()) : [];

    return new User({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      passwordHash: this.passwordHash,
      primaryRole: this.primaryRole,
      restaurantId: this.restaurantId,
      branchId: this.branchId,
      status: this.status,
      isEmailVerified: this.isEmailVerified,
      lastLoginAt: this.lastLoginAt,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      roles,
    });
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    primaryRole: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.STAFF,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.PENDING,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["status"] },
      { fields: ["primaryRole"] },
      { fields: ["restaurantId"] },
      { fields: ["branchId"] },
    ],
  },
);

module.exports = UserModel;
