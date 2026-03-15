"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_UserRoles_role" AS ENUM
       ('superAdmin', 'admin', 'manager', 'staff', 'chef', 'delivery');`,
    );

    await queryInterface.createTable("UserRoles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      role: {
        type: Sequelize.ENUM(
          "superAdmin",
          "admin",
          "manager",
          "staff",
          "chef",
          "delivery",
        ),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addIndex("UserRoles", ["userId"]);
    await queryInterface.addIndex("UserRoles", ["role"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UserRoles");
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_UserRoles_role";`,
    );
  },
};
