require("dotenv").config();
const { Router } = require("express");
const analyticsController = require("../controllers/analytics.controller");
const { responseHandler } = require("../helpers/response-handler");
const { checkAccessToken } = require("../middlewares/authenticate");
const analyticsValidator = require("../validate/analytics.validate");
const { urlAnalyticsLimiter } = require("../middlewares/rate-limiter");
const { checkAliasOwnership } = require("../middlewares/authorize");

const router = Router();

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieves overall analytics for the authenticated user, including total URL visits, trends, and user engagement data.
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
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUrls:
 *                       type: integer
 *                       example: 2
 *                     totalClicks:
 *                       type: integer
 *                       example: 3
 *                     uniqueUsers:
 *                       type: integer
 *                       example: 2
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-09T18:30:00.000Z"
 *                           click_count:
 *                             type: string
 *                             example: "1"
 *                     osType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           os_name:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           unique_users:
 *                             type: string
 *                             example: "1"
 *                           unique_clicks:
 *                             type: string
 *                             example: "3"
 *                     deviceType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           device_name:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           unique_users:
 *                             type: string
 *                             example: "1"
 *                           unique_clicks:
 *                             type: string
 *                             example: "3"
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
 *     description: Retrieves analytics for a specific short URL alias, including total clicks, unique users, device types, and OS statistics.
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
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClicks:
 *                       type: integer
 *                       example: 1
 *                     uniqueUsers:
 *                       type: integer
 *                       example: 1
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-09T18:30:00.000Z"
 *                           click_count:
 *                             type: string
 *                             example: "1"
 *                     osType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           os_name:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           unique_users:
 *                             type: string
 *                             example: "1"
 *                           unique_clicks:
 *                             type: string
 *                             example: "1"
 *                     deviceType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           device_name:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           unique_users:
 *                             type: string
 *                             example: "1"
 *                           unique_clicks:
 *                             type: string
 *                             example: "1"
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
  checkAliasOwnership,
  analyticsController.getUrlAnalytics,
  responseHandler
);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get topic-based analytics
 *     description: Retrieves analytics for a specific topic, including total clicks, unique users, and URL visit statistics.
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
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClicks:
 *                       type: integer
 *                       example: 100
 *                     uniqueUsers:
 *                       type: integer
 *                       example: 50
 *                     clicksByDate:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "YYYY-MM-DDTHH:MM:SSZ"
 *                           click_count:
 *                             type: integer
 *                             example: 10
 *                     urls:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shortUrl:
 *                             type: string
 *                             example: "http://short.url/example"
 *                           totalClicks:
 *                             type: integer
 *                             example: 100
 *                           uniqueUsers:
 *                             type: integer
 *                             example: 50
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
