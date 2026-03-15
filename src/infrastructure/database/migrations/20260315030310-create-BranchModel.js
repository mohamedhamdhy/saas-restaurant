"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_branches_status" AS ENUM
       ('active', 'inactive', 'closed');`,
    );

    await queryInterface.createTable("branches", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      restaurantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "restaurants", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      address: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },

      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },

      businessHours: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("active", "inactive", "closed"),
        allowNull: false,
        defaultValue: "active",
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

    await queryInterface.addIndex("branches", ["restaurantId"]);
    await queryInterface.addIndex("branches", ["status"]);
    await queryInterface.addIndex("branches", ["city"]);
    await queryInterface.addIndex("branches", ["country"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("branches");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_branches_status";`,
    );
  },
};
