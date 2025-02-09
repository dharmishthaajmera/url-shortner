const { client } = require("../redis"); // Import Redis client

// Middleware function for caching
const fetchFromCache = async (key, res) => {
  const cacheKey = key;

  if (!cacheKey) return false;

  try {
    // Get data from Redis cache

    const data = await client.get(cacheKey);

    if (data) {
      // If data is found in cache, return it
      res.status(200).json({
        message: "Success",
        data: JSON.parse(data),
      });

      return true;
    }

    // If data is not found in cache, move on
    return false;
  } catch (err) {
    console.error("Failed to fetch data from Redis", err);
    return null;
  }
};

// Function to save data in cache
const saveToCache = async (key, data, expiration = 300) => {
  try {
    // Save data in Redis cache with expiration time (in seconds)
    await client.setEx(key, expiration, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save data to Redis", err);
  }
};

module.exports = { fetchFromCache, saveToCache };
