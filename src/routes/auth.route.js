const { Router } = require("express");
const router = Router();

const {
  getGoogleAuthUrl,
  userRegisterAndLogin,
} = require("../controllers/auth.controller");

router.get("/auth/google", getGoogleAuthUrl);

// Callback URL for handling the Google Login response
router.get("/auth/google/callback", userRegisterAndLogin);

module.exports = router;
