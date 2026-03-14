"use strict";

const { v4: uuidv4 } = require("uuid");
const User = require("../../domain/entities/User");
const UserRole = require("../../domain/enums/UserRole");
const UserStatus = require("../../domain/enums/UserStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { hashPassword } = require("../../shared/utils/passwordUtils");

class RegisterFirstSuperAdmin {
  /**
   * @param {import('../../domain/interfaces/IUserRepository')} userRepository
   */
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {{ firstName, lastName, email, password, phone? }} dto
   */
  async execute({ firstName, lastName, email, password, phone }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(
        "Email already in use.",
        409,
        CODES.USER_ALREADY_EXISTS,
      );
    }

    const platformAdmins = await this.userRepository.findAllPlatformAdmins();
    if (platformAdmins.total > 0) {
      throw new AppError(
        "A Super Admin already exists. Use CreateUser to add more platform staff.",
        409,
        CODES.SUPERADMIN_EXISTS,
      );
    }

    const passwordHash = await hashPassword(password);

    const superAdmin = new User({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      passwordHash,
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      restaurantId: null,
      isEmailVerified: true,
    });

    const created = await this.userRepository.create(superAdmin);
    return created.toPublicJSON();
  }
}

module.exports = RegisterFirstSuperAdmin;
