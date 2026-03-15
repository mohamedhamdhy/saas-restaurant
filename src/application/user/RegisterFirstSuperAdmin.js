"use strict";

const { v4: uuidv4 } = require("uuid");
const User = require("../../domain/entities/User");
const UserRoleAssignment = require("../../domain/entities/UserRoleAssignment");
const UserRole = require("../../domain/enums/UserRole");
const UserStatus = require("../../domain/enums/UserStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { hashPassword } = require("../../shared/utils/passwordUtils");

class RegisterFirstSuperAdmin {
  constructor({ userRepository, userRoleRepository }) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
  }

  async execute({ firstName, lastName, email, password, phone }) {
    const existing = await this.userRepository.existsByEmail(email);
    if (existing) {
      throw new AppError(
        "Email already in use.",
        409,
        CODES.USER_ALREADY_EXISTS,
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = uuidv4();

    const user = new User({
      id: userId,
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      passwordHash,
      primaryRole: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    });

    await this.userRepository.create(user);

    await this.userRoleRepository.assign(
      new UserRoleAssignment({
        id: uuidv4(),
        userId,
        role: UserRole.SUPER_ADMIN,
        restaurantId: null,
        branchId: null,
      }),
    );

    const created = await this.userRepository.findById(userId);
    return created.toPublicJSON();
  }
}

module.exports = RegisterFirstSuperAdmin;
