"use strict";

module.exports = Object.freeze({
  DEFAULT_PAGE_LIMIT: 20,
  MAX_PAGE_LIMIT: 100,

  ACCESS_TOKEN_HEADER: "authorization",
  SETUP_SECRET_HEADER: "x-setup-secret",

  ENV: {
    DEV: "development",
    TEST: "test",
    PRODUCTION: "production",
  },

  API_PREFIX: "/api/v1",
});
