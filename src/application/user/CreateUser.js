"use strict";

const { v4: uuidv4 } = require("uuid");
const User = require("../../domain/entities/User");
const UserRoleAssignment = require("../../domain/entities/UserRoleAssignment");
const UserRole = require("../../domain/enums/UserRole");
const UserStatus = require("../../domain/enums/UserStatus");
const AppError = require("../../shared/errors/AppError");
const CODES = require("../../shared/errors/ErrorCodes");
const { hashPassword } = require("../../shared/utils/passwordUtils");

const BRANCH_ROLES = [
  UserRole.MANAGER,
  UserRole.STAFF,
  UserRole.CHEF,
  UserRole.DELIVERY,
];

class CreateUser {
  constructor({
    userRepository,
    userRoleRepository,
    restaurantRepository,
    branchRepository,
  }) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.restaurantRepository = restaurantRepository;
    this.branchRepository = branchRepository;
  }

  async execute(actor, dto) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone = null,
      role,
      restaurantId = null,
      branchId = null,
    } = dto;

    if (!actor.isSuperAdmin()) {
      if (!actor.isAdmin()) {
        throw new AppError(
          "Only superAdmin or admin can create users.",
          403,
          CODES.FORBIDDEN,
        );
      }
      if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
        throw new AppError(
          "You cannot assign this role.",
          403,
          CODES.FORBIDDEN,
        );
      }
      if (restaurantId !== actor.restaurantId) {
        throw new AppError(
          "You can only create users within your own restaurant.",
          403,
          CODES.FORBIDDEN,
        );
      }
    }

    if (role === UserRole.SUPER_ADMIN) {
      if (restaurantId || branchId) {
        throw new AppError(
          "superAdmin must not be scoped to a restaurant or branch.",
          400,
          CODES.VALIDATION_ERROR,
        );
      }
    } else if (role === UserRole.ADMIN) {
      if (!restaurantId) {
        throw new AppError(
          "Admin must be assigned to a restaurant.",
          400,
          CODES.RESTAURANT_REQUIRED,
        );
      }
      if (branchId) {
        throw new AppError(
          "Admin must not be scoped to a branch.",
          400,
          CODES.VALIDATION_ERROR,
        );
      }

      const restaurant = await this.restaurantRepository.findById(restaurantId);
      if (!restaurant) {
        throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
      }

      const adminExists =
        await this.userRoleRepository.existsAdminInRestaurant(restaurantId);
      if (adminExists) {
        throw new AppError(
          "This restaurant already has an admin. Each restaurant can only have one admin.",
          409,
          CODES.INVALID_ROLE_ASSIGNMENT,
        );
      }
    } else if (BRANCH_ROLES.includes(role)) {
      if (!restaurantId) {
        throw new AppError(
          `Role "${role}" requires a restaurantId.`,
          400,
          CODES.RESTAURANT_REQUIRED,
        );
      }
      if (!branchId) {
        throw new AppError(
          `Role "${role}" requires a branchId. Create a branch first before assigning branch-level roles.`,
          400,
          CODES.VALIDATION_ERROR,
        );
      }

      const restaurant = await this.restaurantRepository.findById(restaurantId);
      if (!restaurant) {
        throw new AppError("Restaurant not found.", 404, CODES.USER_NOT_FOUND);
      }

      const branch = await this.branchRepository.findById(branchId);
      if (!branch) {
        throw new AppError(
          "Branch not found. Create the branch first before assigning users to it.",
          404,
          CODES.USER_NOT_FOUND,
        );
      }

      if (branch.restaurantId !== restaurantId) {
        throw new AppError(
          "This branch does not belong to the specified restaurant.",
          400,
          CODES.VALIDATION_ERROR,
        );
      }

      if (role === UserRole.MANAGER) {
        const managerExists =
          await this.userRoleRepository.existsManagerInBranch(branchId);
        if (managerExists) {
          throw new AppError(
            "This branch already has a manager. Each branch can only have one manager.",
            409,
            CODES.INVALID_ROLE_ASSIGNMENT,
          );
        }
      }
    } else {
      throw new AppError(`Unknown role: ${role}`, 400, CODES.VALIDATION_ERROR);
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
    const userId = uuidv4();

    const user = new User({
      id: userId,
      firstName,
      lastName,
      email,
      phone: phone ?? null,
      passwordHash,
      primaryRole: role,
      restaurantId: restaurantId ?? null,
      branchId: branchId ?? null,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      roles: [],
    });

    await this.userRepository.create(user);

    const assignment = new UserRoleAssignment({
      id: uuidv4(),
      userId,
      role,
    });

    await this.userRoleRepository.assign(assignment);

    if (role === UserRole.ADMIN && restaurantId) {
      await this.restaurantRepository.update(restaurantId, {
        ownerId: userId,
      });
    }

    const created = await this.userRepository.findById(userId);
    return created.toPublicJSON();
  }
}

module.exports = CreateUser;
