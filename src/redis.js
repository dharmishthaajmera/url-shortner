require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_SERVER_PORT}`,
});

// Function to initialize Redis connection
const connectRedis = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection error:", err);
    process.exit(1);
  }
};

module.exports = { client, connectRedis };
