"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_restaurants_status" AS ENUM
       ('active', 'inactive', 'suspended', 'pendingApproval');`,
    );

    await queryInterface.createTable("restaurants", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      logoUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      website: {
        type: Sequelize.STRING(500),
        allowNull: true,
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

      status: {
        type: Sequelize.ENUM(
          "active",
          "inactive",
          "suspended",
          "pendingApproval",
        ),
        allowNull: false,
        defaultValue: "pendingApproval",
      },

      ownerId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      deletedAt: {
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

    await queryInterface.addIndex("restaurants", ["email"], { unique: true });
    await queryInterface.addIndex("restaurants", ["status"]);
    await queryInterface.addIndex("restaurants", ["ownerId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("restaurants");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_restaurants_status";`,
    );
  },
};
