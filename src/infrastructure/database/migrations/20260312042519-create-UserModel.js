"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Note: We keep the type names descriptive; names can be snake_case or camelCase.
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_users_role" AS ENUM ('superAdmin', 'admin', 'manager', 'staff');`,
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_users_status" AS ENUM ('active', 'inactive', 'suspended', 'pending');`,
    );

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      passwordHash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("superAdmin", "admin", "manager", "staff"),
        allowNull: false,
        defaultValue: "staff",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      restaurantId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addIndex("users", ["email"], { unique: true });
    await queryInterface.addIndex("users", ["restaurantId"]);
    await queryInterface.addIndex("users", ["role"]);
    await queryInterface.addIndex("users", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_users_role";`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_users_status";`,
    );
  },
};
