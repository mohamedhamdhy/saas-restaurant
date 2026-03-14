"use strict";

const { Router } = require("express");
const authorize = require("../middlewares/Authorize");
const {
  validate,
  createRestaurantSchema,
  updateRestaurantSchema,
  listRestaurantsSchema,
  restaurantIdSchema,
  deleteRestaurantSchema,
} = require("../validators/RestaurantValidator");

const restaurantRoutes = (controller, authenticate) => {
  const router = Router();

  router.post(
    "/restaurants",
    authenticate,
    authorize("superAdmin"),
    validate(createRestaurantSchema),
    controller.handleCreateRestaurant,
  );

  router.get(
    "/restaurants",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(listRestaurantsSchema, "query"),
    controller.handleListRestaurants,
  );

  router.get(
    "/restaurants/:restaurantId",
    authenticate,
    authorize("superAdmin", "admin", "manager", "staff"),
    validate(restaurantIdSchema, "params"),
    controller.handleGetRestaurant,
  );

  router.patch(
    "/restaurants/:restaurantId",
    authenticate,
    authorize("superAdmin", "admin"),
    validate(restaurantIdSchema, "params"),
    validate(updateRestaurantSchema),
    controller.handleUpdateRestaurant,
  );

  router.delete(
    "/restaurants/:restaurantId",
    authenticate,
    authorize("superAdmin"),
    validate(restaurantIdSchema, "params"),
    validate(deleteRestaurantSchema),
    controller.handleDeleteRestaurant,
  );

  router.post(
    "/restaurants/:restaurantId/restore",
    authenticate,
    authorize("superAdmin"),
    validate(restaurantIdSchema, "params"),
    controller.handleRestoreRestaurant,
  );

  return router;
};

module.exports = restaurantRoutes;
