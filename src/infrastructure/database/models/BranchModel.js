"use strict";

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../Connection");
const BranchStatus = require("../../../domain/enums/BranchStatus");

class BranchModel extends Model {
  toEntity() {
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
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

BranchModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    businessHours: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BranchStatus)),
      allowNull: false,
      defaultValue: BranchStatus.ACTIVE,
    },
  },
  {
    sequelize,
    modelName: "Branch",
    tableName: "branches",
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ["restaurantId"] },
      { fields: ["status"] },
      { fields: ["city"] },
      { fields: ["country"] },
    ],
  },
);

module.exports = BranchModel;
