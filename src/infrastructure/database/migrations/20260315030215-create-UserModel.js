"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_users_status" AS ENUM
       ('active', 'inactive', 'suspended', 'pending');`,
    );

    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_users_primaryRole" AS ENUM
       ('superAdmin', 'admin', 'manager', 'staff', 'chef', 'delivery');`,
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

      primaryRole: {
        type: Sequelize.ENUM(
          "superAdmin",
          "admin",
          "manager",
          "staff",
          "chef",
          "delivery",
        ),
        allowNull: false,
        defaultValue: "staff",
      },

      restaurantId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      branchId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("active", "inactive", "suspended", "pending"),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("users", ["email"], { unique: true });
    await queryInterface.addIndex("users", ["status"]);
    await queryInterface.addIndex("users", ["primaryRole"]);
    await queryInterface.addIndex("users", ["restaurantId"]);
    await queryInterface.addIndex("users", ["branchId"]);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_admin_per_restaurant
      ON users ("restaurantId", "primaryRole")
      WHERE "primaryRole" = 'admin'
        AND "restaurantId" IS NOT NULL
        AND "deletedAt" IS NULL;
    `);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_manager_per_branch
      ON users ("branchId", "primaryRole")
      WHERE "primaryRole" = 'manager'
        AND "branchId" IS NOT NULL
        AND "deletedAt" IS NULL;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS unique_admin_per_restaurant;`,
    );
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS unique_manager_per_branch;`,
    );
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_users_status";`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_users_primaryRole";`,
    );
  },
};
