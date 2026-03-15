"use strict";

const { Router } = require("express");
const authorize = require("../middlewares/Authorize");
const setupGuard = require("../middlewares/SetupGuard");

const {
  validate,
  registerSuperAdminSchema,
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  listUsersSchema,
} = require("../validators/UserValidator");

const userRoutes = (controller, authenticate) => {
  const router = Router();

  router.post(
    "/setup/superAdmin",
    setupGuard,
    validate(registerSuperAdminSchema),
    controller.handleRegisterSuperAdmin,
  );

  router.post("/auth/login", validate(loginSchema), controller.handleLogin);
  router.post(
    "/auth/refresh",
    validate(refreshTokenSchema),
    controller.handleRefreshToken,
  );
  router.post("/auth/logout", authenticate, controller.handleLogout);

  router.post(
    "/users",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(createUserSchema),
    controller.handleCreateUser,
  );

  router.get(
    "/users",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(listUsersSchema, "query"),
    controller.handleListUsers,
  );

  router.get("/users/:id", authenticate, controller.handleGetProfile);

  router.patch(
    "/users/:id",
    authenticate,
    validate(updateProfileSchema),
    controller.handleUpdateProfile,
  );

  router.patch(
    "/users/:id/password",
    authenticate,
    validate(changePasswordSchema),
    controller.handleChangePassword,
  );

  router.delete(
    "/users/:id",
    authenticate,
    authorize("superAdmin", "admin"),
    controller.handleDeleteUser,
  );

  return router;
};

module.exports = userRoutes;
