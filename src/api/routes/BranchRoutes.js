"use strict";

const { Router } = require("express");
const authorize = require("../middlewares/Authorize");
const {
  validate,
  createBranchSchema,
  updateBranchSchema,
  listBranchesSchema,
  branchIdSchema,
  deleteBranchSchema,
} = require("../validators/RestaurantValidator");

const branchRoutes = (controller, authenticate) => {
  const router = Router();

  router.post(
    "/branches",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(createBranchSchema),
    controller.handleCreateBranch,
  );

  router.get(
    "/branches",
    authenticate,
    authorize("superAdmin", "admin", "manager", "staff"),
    validate(listBranchesSchema, "query"),
    controller.handleListBranches,
  );

  router.get(
    "/branches/:branchId",
    authenticate,
    authorize("superAdmin", "admin", "manager", "staff"),
    validate(branchIdSchema, "params"),
    controller.handleGetBranch,
  );

  router.patch(
    "/branches/:branchId",
    authenticate,
    authorize("superAdmin", "admin", "manager"),
    validate(branchIdSchema, "params"),
    validate(updateBranchSchema),
    controller.handleUpdateBranch,
  );

  router.delete(
    "/branches/:branchId",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(branchIdSchema, "params"),
    validate(deleteBranchSchema),
    controller.handleDeleteBranch,
  );

  router.post(
    "/branches/:branchId/restore",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(branchIdSchema, "params"),
    controller.handleRestoreBranch,
  );

  return router;
};

module.exports = branchRoutes;
