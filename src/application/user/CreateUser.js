"use strict";

const { v4: uuidv4 } = require("uuid");
const User = require("../../domain/entities/User");
const UserRole = require("../../domain/enums/UserRole");
const UserStatus = require("../../domain/enums/UserStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { hashPassword } = require("../../shared/utils/passwordUtils");

class CreateUser {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  /**
   * @param {User}   actor
   * @param {object} dto
   */
  async execute(
    actor,
    { firstName, lastName, email, password, role, restaurantId, phone },
  ) {
    const allowedRoles = actor.creatableRoles();
    if (allowedRoles.length === 0) {
      throw new AppError(
        "You do not have permission to create users.",
        403,
        CODES.FORBIDDEN,
      );
    }

    if (!allowedRoles.includes(role)) {
      throw new AppError(
        `Your role (${actor.role}) cannot create a user with role "${role}".`,
        403,
        CODES.INVALID_ROLE_ASSIGNMENT,
      );
    }

    if (role === UserRole.SUPERADMIN) {
      restaurantId = null;
    } else {
      if (!restaurantId) {
        throw new AppError(
          `Role "${role}" must be assigned to a restaurant.`,
          400,
          CODES.RESTAURANT_REQUIRED,
        );
      }

      if (actor.isAdmin() && actor.restaurantId !== restaurantId) {
        throw new AppError(
          "You can only create users within your own restaurant.",
          403,
          CODES.FORBIDDEN,
        );
      }
    }

    const emailTaken = await this.userRepository.existsByEmail(email);
    if (emailTaken) {
      throw new AppError(
        "Email already in use.",
        409,
        CODES.USER_ALREADY_EXISTS,
      );
    }

    const passwordHash = await hashPassword(password);

    const user = new User({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      passwordHash,
      role,
      status: UserStatus.ACTIVE,
      restaurantId,
      isEmailVerified: false,
    });

    const created = await this.userRepository.create(user);
    return created.toPublicJSON();
  }
}

module.exports = CreateUser;
