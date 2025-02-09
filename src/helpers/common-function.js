const jwt = require("jsonwebtoken");

// Function to generate JWT tokens
const generateTokens = async (user) => {
  const { user_id, email } = user;

  const accessToken = jwt.sign(
    { userId: user_id, email: email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: user_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  let date = new Date();
  const expiry_time = new Date(date.setDate(date.getDate() + 7));

  return { accessToken, refreshToken, expiry_time };
};

module.exports = { generateTokens };
