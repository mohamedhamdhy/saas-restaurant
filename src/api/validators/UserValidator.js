"use strict";

const Joi = require("joi");
const UserRole = require("../../domain/enums/UserRole");

const email = Joi.string().email().lowercase().trim().required();
const password = Joi.string()
  .min(8)
  .max(72)
  .required()
  .messages({ "string.min": "Password must be at least 8 characters." });
const uuid = Joi.string().uuid({ version: "uuidv4" });
const firstName = Joi.string().min(2).max(100).trim().required();
const lastName = Joi.string().min(2).max(100).trim().required();
const phone = Joi.string()
  .pattern(/^\+?[0-9\s\-().]{7,20}$/)
  .optional()
  .allow(null, "");

const registerSuperAdminSchema = Joi.object({
  firstName,
  lastName,
  email,
  password,
  phone,
});

const createUserSchema = Joi.object({
  firstName,
  lastName,
  email,
  password,
  phone,
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(UserRole).join(", ")}`,
    }),
  restaurantId: uuid.optional().allow(null),
  branchId: uuid.optional().allow(null),
});

const loginSchema = Joi.object({
  email,
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).trim(),
  lastName: Joi.string().min(2).max(100).trim(),
  phone,
  status: Joi.string().valid("active", "inactive", "suspended", "pending"),
})
  .min(1)
  .messages({ "object.min": "Provide at least one field to update." });

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: password,
});

const listUsersSchema = Joi.object({
  restaurantId: uuid.optional(),
  branchId: uuid.optional(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  status: Joi.string()
    .valid("active", "inactive", "suspended", "pending")
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

/**
 * @param {Joi.Schema} schema
 * @param {'body'|'query'|'params'} source
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        errors: details,
      });
    }

    if (source === "query" || source === "params") {
      Object.assign(req[source], value);
    } else {
      req[source] = value;
    }

    next();
  };
};

module.exports = {
  validate,
  registerSuperAdminSchema,
  createUserSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  listUsersSchema,
};
