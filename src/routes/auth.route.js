const { Router } = require("express");
const router = Router();

const {
  getGoogleAuthUrl,
  userRegisterAndLogin,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Get Google OAuth URL
 *     description: Redirects the user to Google's OAuth authentication page.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google's OAuth authentication page.
 */
router.get("/auth/google", getGoogleAuthUrl);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     description: Handles the OAuth response from Google, registers or logs in the user, and sets authentication tokens.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code received from Google OAuth.
 *     responses:
 *       302:
 *         description: Redirects to the health check endpoint after authentication.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/auth/google/callback", userRegisterAndLogin);

module.exports = router;
