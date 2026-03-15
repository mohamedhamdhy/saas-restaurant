"use strict";

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../Connection");
const RestaurantStatus = require("../../../domain/enums/RestaurantStatus");

class RestaurantModel extends Model {
  toEntity() {
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
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

RestaurantModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING(500),
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

    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RestaurantStatus)),
      allowNull: false,
      defaultValue: RestaurantStatus.PENDING_APPROVAL,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Restaurant",
    tableName: "restaurants",
    timestamps: true,
    paranoid: true,
    indexes: [{ fields: ["status"] }, { fields: ["ownerId"] }],
  },
);

module.exports = RestaurantModel;
