const rateLimit = require("express-rate-limit");

const shortenUrlLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 10 minutes",
});

const urlAnalyticsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 10 minutes",
});

module.exports = { shortenUrlLimiter, urlAnalyticsLimiter };
