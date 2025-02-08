require("dotenv").config();
const { Pool } = require("pg");

// Create a connection pool
const pool = new Pool({
  // user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Function to connect to the database
const dbConnect = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database");
    client.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

// Function to execute SQL queries
async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release(); // Ensure the connection is released back to the pool
  }
}

module.exports = { dbConnect, executeQuery };
