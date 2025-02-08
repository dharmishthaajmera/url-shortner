const jwt = require("jsonwebtoken");
const {
  customException,
  commonErrorHandler,
} = require("../helpers/error-handler");

const checkAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const accessToken = token ? token.split(" ")[1] : null;

    if (!accessToken) {
      throw customException("Access denied", 401);
    }
    const decodedJwt = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decodedJwt;

    next();
  } catch (error) {
    console.log("checkAccessToken error:", error);
    const statusCode = error.status || 401;
    commonErrorHandler(req, res, error.message, statusCode);
  }
};

module.exports = {
  checkAccessToken,
};
