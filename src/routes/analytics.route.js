require("dotenv").config();
const { Router } = require("express");
const analyticsController = require("../controllers/analytics.controller");
const { responseHandler } = require("../helpers/response-handler");
const { checkAccessToken } = require("../middlewares/authenticate");
const analyticsValidator = require("../validate/analytics.validate");
const { urlAnalyticsLimiter } = require("../middlewares/rate-limiter");

const router = Router();

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieves overall analytics for the authenticated user, including total URL visits and trends.
 *     tags:
 *       - Analytics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 totalUrls: 10
 *                 totalVisits: 500
 *                 topVisitedUrls:
 *                   - alias: "abc123"
 *                     visits: 120
 *                   - alias: "xyz789"
 *                     visits: 80
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 */
router.get(
  "/api/analytics/overall",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsController.getOverallAnalytics,
  responseHandler
);

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific short URL
 *     description: Retrieves analytics for a specific short URL alias, including visit count and geolocation data.
 *     tags:
 *       - Analytics
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias to fetch analytics for
 *     responses:
 *       200:
 *         description: URL analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 alias: "abc123"
 *                 totalVisits: 150
 *                 geolocation:
 *                   - country: "US"
 *                     visits: 90
 *                   - country: "IN"
 *                     visits: 60
 *       404:
 *         description: Short URL not found
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 */
router.get(
  "/api/analytics/:alias",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsValidator.aliasAnalytics,
  analyticsController.getUrlAnalytics,
  responseHandler
);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get topic-based analytics
 *     description: Retrieves analytics for a specific topic, showing total visits and most popular URLs.
 *     tags:
 *       - Analytics
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic to fetch analytics for
 *     responses:
 *       200:
 *         description: Topic analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 topic: "tech"
 *                 totalVisits: 300
 *                 topUrls:
 *                   - alias: "tech123"
 *                     visits: 120
 *                   - alias: "dev456"
 *                     visits: 80
 *       404:
 *         description: Topic not found
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 */
router.get(
  "/api/analytics/topic/:topic",
  urlAnalyticsLimiter,
  checkAccessToken,
  analyticsValidator.topicAnalytics,
  analyticsController.getTopicAnalytics,
  responseHandler
);

module.exports = router;
