"use strict";

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../Connection");
const UserRole = require("../../../domain/enums/UserRole");
const UserRoleAssignment = require("../../../domain/entities/UserRoleAssignment");

class UserRoleModel extends Model {
  toEntity() {
    return new UserRoleAssignment({
      id: this.id,
      userId: this.userId,
      role: this.role,
      createdAt: this.createdAt,
    });
  }
}

UserRoleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "UserRoles",
    timestamps: false,
    createdAt: "createdAt",
    indexes: [{ fields: ["userId"] }, { fields: ["role"] }],
  },
);

module.exports = UserRoleModel;
