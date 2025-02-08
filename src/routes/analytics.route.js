require("dotenv").config();
const { Router } = require("express");
const analyticsController = require("../controllers/analytics.controller");
const { responseHandler } = require("../helpers/response-handler");
const { checkAccessToken } = require("../middlewares/authenticate");
const analyticsValidator = require("../validate/analytics.validate");
const { urlAnalyticsLimiter } = require("../helpers/rate-limiter");

const router = Router();

// Get Overall Analytics API
router.get(
  "/api/analytics/overall",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsValidator.overallAnalytics,
  analyticsController.getOverallAnalytics,
  responseHandler
);

// API to Get URL Analytics
router.get(
  "/api/analytics/:alias",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsValidator.aliasAnalytics,
  analyticsController.getUrlAnalytics,
  responseHandler
);

// API to Get Topic-Based Analytics
router.get(
  "/api/analytics/topic/:topic",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsValidator.topicAnalytics,
  analyticsController.getTopicAnalytics,
  responseHandler
);

module.exports = router;
