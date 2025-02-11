require("dotenv").config();
const { Router } = require("express");
const { checkAccessToken } = require("../middlewares/authenticate");
const urlShortnerController = require("../controllers/url-shortner.controller");
const { responseHandler } = require("../helpers/response-handler");
const urlShortnerValidator = require("../validate/url-shortner.validate");
const { shortenUrlLimiter } = require("../middlewares/rate-limiter");

const router = Router();

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Generates a short URL from a long URL, with an optional custom alias and topic.
 *     tags:
 *       - URL Shortener
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "<your_long_url>"
 *               customAlias:
 *                 type: string
 *                 example: "<your_custom_alias>"
 *               topic:
 *                 type: string
 *                 example: "<your_topic>"
 *     responses:
 *       201:
 *         description: Short URL created successfully
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
 *                     shortUrl:
 *                       type: string
 *                       example: "<generated_short_url>"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "<timestamp>"
 *       400:
 *         description: Invalid request or custom alias already exists
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 */

router.post(
  "/api/shorten",
  shortenUrlLimiter,
  checkAccessToken,
  urlShortnerValidator.shortenUrl,
  urlShortnerController.generateShortUrl,
  responseHandler
);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     description: Retrieves the original long URL for a given short alias and redirects the user. (swagger does not support redirect response)
 *     tags:
 *       - URL Shortener
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short alias for the URL
 *     responses:
 *       307:
 *         description: Redirects to the original long URL
 *       404:
 *         description: Short URL not found
 *       401:
 *         description: Unauthorized - Invalid or missing access token
 */
router.get(
  "/api/shorten/:alias",
  urlShortnerValidator.urlAlias,
  urlShortnerController.getUrlAlias
);

module.exports = router;
