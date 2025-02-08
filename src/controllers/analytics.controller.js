const analyticsServices = require("../services/analytics.service");
const { commonErrorHandler } = require("../helpers/error-handler");

const getUrlAnalytics = async (req, res, next) => {
  const { alias } = req.params;

  try {
    const result = await analyticsServices.fetchUrlAnalytics(alias);

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    req.statusCode = 200;
    req.data = result;
    next();
  } catch (error) {
    console.log("Error fetching URL analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getTopicAnalytics = async (req, res, next) => {
  const { topic } = req.params;

  try {
    const result = await analyticsServices.fetchTopicAnalytics(topic);

    if (!result) {
      return res.status(404).json({ error: "Topic not found" });
    }

    req.statusCode = 200;
    req.data = result;
    next();
  } catch (error) {
    console.log("Error fetching topic analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

const getOverallAnalytics = async (req, res, next) => {
  const userId = "112540772628843966080"; // Assuming user ID is available from authentication middleware

  try {
    const result = await analyticsServices.fetchOverallAnalytics(userId);

    req.statusCode = 200;
    req.data = result;
    next();
  } catch (error) {
    console.log("Error fetching overall analytics:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

module.exports = { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics };
