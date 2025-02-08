require("dotenv").config();
const { Router } = require("express");
const { checkAccessToken } = require("../middlewares/authenticate");
const urlShortnerController = require("../controllers/url-shortner.controller");
const { responseHandler } = require("../helpers/response-handler");
const urlShortnerValidator = require("../validate/url-shortner.validate");
const { shortenUrlLimiter } = require("../helpers/rate-limiter");
const router = Router();

// API to Create a Short URL
router.post(
  "/api/shorten",
  shortenUrlLimiter,
  checkAccessToken,
  urlShortnerValidator.shortenUrl,
  urlShortnerController.generateShortUrl,
  responseHandler
);

// Redirect API: Lookup and Redirect to Long URL
router.get(
  "/api/shorten/:alias",
  checkAccessToken,
  urlShortnerValidator.urlAlias,
  urlShortnerController.getUrlAlias
);

module.exports = router;
