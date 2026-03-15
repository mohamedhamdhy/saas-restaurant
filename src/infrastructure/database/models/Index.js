"use strict";

const UserModel = require("./UserModel");
const UserRoleModel = require("./UserRoleModel");

if (!UserModel.associations.UserRoles) {
  UserModel.hasMany(UserRoleModel, {
    foreignKey: "userId",
    as: "UserRoles",
  });

  UserRoleModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "User",
  });
}

module.exports = { UserModel, UserRoleModel };
