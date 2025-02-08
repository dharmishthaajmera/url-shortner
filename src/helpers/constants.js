const rateLimitConfig = {
  "/api/shorten": {
    windowMs: 1 * 60 * 1000,
    max: 2,
    message: {
      error: "Too many URL creation attempts. Please try again later.",
    },
    keyGenerator: (req) => req.ip,
  },
  "/": {
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { error: "Too analytics attempts. Please try again later." },
    keyGenerator: (req) => req.ip,
  },
};

module.exports = { rateLimitConfig };
