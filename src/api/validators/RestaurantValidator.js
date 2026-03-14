"use strict";

const Joi = require("joi");
const RestaurantStatus = require("../../domain/enums/RestaurantStatus");
const BranchStatus = require("../../domain/enums/BranchStatus");
const { validate } = require("./UserValidator");

const uuid = Joi.string().uuid({ version: "uuidv4" });
const phone = Joi.string()
  .pattern(/^\+?[0-9\s\-().]{7,20}$/)
  .optional()
  .allow(null, "");
const email = Joi.string()
  .email()
  .lowercase()
  .trim()
  .optional()
  .allow(null, "");
const url = Joi.string().uri().optional().allow(null, "");
const latLng = Joi.number().optional().allow(null);
const daySchema = Joi.object({
  open: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  close: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  isClosed: Joi.boolean().required(),
});

const businessHoursSchema = Joi.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
})
  .optional()
  .allow(null);

const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(150).trim().required(),
  description: Joi.string().max(1000).trim().optional().allow(null, ""),
  logoUrl: url,
  phone,
  email,
  website: url,
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(150).trim(),
  description: Joi.string().max(1000).trim().optional().allow(null, ""),
  logoUrl: url,
  phone,
  email,
  website: url,
  status: Joi.string().valid(...Object.values(RestaurantStatus)),
})
  .min(1)
  .messages({ "object.min": "Provide at least one field to update." });

const listRestaurantsSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(RestaurantStatus))
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const restaurantIdSchema = Joi.object({
  restaurantId: uuid.required(),
});

const deleteRestaurantSchema = Joi.object({
  force: Joi.boolean().default(false),
});

const createBranchSchema = Joi.object({
  restaurantId: uuid.required(),
  name: Joi.string().min(2).max(150).trim().required(),
  description: Joi.string().max(1000).trim().optional().allow(null, ""),
  phone,
  email,
  address: Joi.string().min(5).max(500).trim().required(),
  city: Joi.string().min(2).max(100).trim().required(),
  country: Joi.string().min(2).max(100).trim().required(),
  latitude: latLng,
  longitude: latLng,
  businessHours: businessHoursSchema,
});

const updateBranchSchema = Joi.object({
  name: Joi.string().min(2).max(150).trim(),
  description: Joi.string().max(1000).trim().optional().allow(null, ""),
  phone,
  email,
  address: Joi.string().min(5).max(500).trim(),
  city: Joi.string().min(2).max(100).trim(),
  country: Joi.string().min(2).max(100).trim(),
  latitude: latLng,
  longitude: latLng,
  businessHours: businessHoursSchema,
  status: Joi.string().valid(...Object.values(BranchStatus)),
})
  .min(1)
  .messages({ "object.min": "Provide at least one field to update." });

const listBranchesSchema = Joi.object({
  restaurantId: uuid.optional(),
  status: Joi.string()
    .valid(...Object.values(BranchStatus))
    .optional(),
  city: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const branchIdSchema = Joi.object({
  branchId: uuid.required(),
});

const deleteBranchSchema = Joi.object({
  force: Joi.boolean().default(false),
});

module.exports = {
  validate,
  createRestaurantSchema,
  updateRestaurantSchema,
  listRestaurantsSchema,
  restaurantIdSchema,
  deleteRestaurantSchema,
  createBranchSchema,
  updateBranchSchema,
  listBranchesSchema,
  branchIdSchema,
  deleteBranchSchema,
};
