const analyticsServices = require("../services/analytics.service");
const { commonErrorHandler } = require("../helpers/error-handler");
const { fetchFromCache, saveToCache } = require("../middlewares/redis-cache");

const getUrlAnalytics = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  const isCached = await fetchFromCache(cacheKey, res);
  if (isCached) return;

  const { alias } = req.params;

  try {
    const result = await analyticsServices.fetchUrlAnalytics(alias);

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    req.statusCode = 200;
    req.data = result;

    saveToCache(cacheKey, result);
    next();
  } catch (error) {
    console.log("Error fetching URL analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getTopicAnalytics = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  const isCached = await fetchFromCache(cacheKey, res);
  if (isCached) return;

  const { topic } = req.params;

  try {
    const result = await analyticsServices.fetchTopicAnalytics(
      topic,
      req.user.userId
    );

    if (!result) {
      return res.status(404).json({ error: "Topic not found" });
    }

    req.statusCode = 200;
    req.data = result;

    saveToCache(cacheKey, result);
    next();
  } catch (error) {
    console.log("Error fetching topic analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

const getOverallAnalytics = async (req, res, next) => {
  const userId = req.user.userId;
  const cacheKey = req.originalUrl + `:${userId}`;
  const isCached = await fetchFromCache(cacheKey, res);
  if (isCached) return;

  try {
    const result = await analyticsServices.fetchOverallAnalytics(userId);

    req.statusCode = 200;
    req.data = result;

    saveToCache(cacheKey, result);
    next();
  } catch (error) {
    console.log("Error fetching overall analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

module.exports = { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics };
