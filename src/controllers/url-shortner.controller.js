const { nanoid } = require("nanoid");
const {
  GET_URL_BY_CUSTOM_ALIAS,
  INSERT_SHORTEN_URL,
  INSERT_URL_ANALYTICS_ON_ACCESS,
} = require("../helpers/queries");
const { executeQuery } = require("../../db-connect");
const { commonErrorHandler } = require("../helpers/error-handler");
const { default: axios } = require("axios");

const generateShortUrl = async (req, res, next) => {
  const userId = req.user.userId;
  const { longUrl, customAlias, topic } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  try {
    let shortCode = customAlias || nanoid(6); // Use custom alias or generate one

    // Start transaction
    await executeQuery("BEGIN");

    // Check if custom alias exists
    if (customAlias) {
      const aliasCheck = await executeQuery(GET_URL_BY_CUSTOM_ALIAS, [
        shortCode,
      ]);
      if (aliasCheck.length > 0) {
        await executeQuery("ROLLBACK");
        return res.status(400).json({ error: "Custom alias already exists" });
      }
    }

    // Insert into database
    const result = await executeQuery(INSERT_SHORTEN_URL, [
      longUrl,
      shortCode || null,
      topic || null,
      userId,
    ]);

    // Commit transaction
    await executeQuery("COMMIT");

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    req.statusCode = 201;
    req.data = { shortUrl, createdAt: result[0].created_at };
    next();
  } catch (error) {
    await executeQuery("ROLLBACK");
    console.log("Error generating short url:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

const getUrlAlias = async (req, res, next) => {
  const { alias } = req.params;
  const userAgent = req.headers["user-agent"];
  const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get user IP

  try {
    // Find the original URL
    const result = await executeQuery(GET_URL_BY_CUSTOM_ALIAS, [alias]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const longUrl = result[0].long_url;

    // Get geolocation data using `ipinfo.io`
    let geoData = {};
    try {
      const response = await axios.get(`https://ipinfo.io/${userIP}/json`);
      geoData = response.data;
    } catch (err) {
      console.error("Failed to fetch geolocation data", err.message);
    }

    // Log the redirect event in analytics
    await executeQuery(INSERT_URL_ANALYTICS_ON_ACCESS, [
      alias,
      userIP || "unknown",
      userAgent || "unknown",
      geoData.country || "unknown",
      geoData.region || "unknown",
      geoData.city || "unknown",
    ]);

    // Redirect user to original long URL
    res.redirect(307, longUrl);
  } catch (error) {
    console.log("Error getting shorten url:", error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

module.exports = { generateShortUrl, getUrlAlias };
