const { executeQuery } = require("../../db-connect");
const { OAuth2Client } = require("google-auth-library");
const { generateTokens } = require("../helpers/common-function");
const {
  GET_USER_WITH_ID,
  ADD_USER,
  INSERT_AUTH_TOKEN,
  GET_AUTH_TOKEN,
  DELETE_EXISTING_SESSION,
} = require("../helpers/queries");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require("axios");

const getGoogleAuthUrl = async (req, res, next) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
};

const userRegisterAndLogin = async (req, res, next) => {
  const { code } = req.query;

  try {
    await executeQuery("BEGIN");
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { id_token } = data;

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Code to handle user authentication and retrieval using the profile data
    let userDetails = await executeQuery(GET_USER_WITH_ID, [sub]);

    const userExists = userDetails.length > 0;
    if (!userExists) {
      userDetails = await executeQuery(ADD_USER, [sub, email, name]);
    } else {
      const sessionDetails = await executeQuery(GET_AUTH_TOKEN, [sub]);
      if (sessionDetails.length > 0) {
        await executeQuery(DELETE_EXISTING_SESSION, [sub]);
      }
    }

    // Generate tokens
    const { accessToken, refreshToken, expiry_time } = await generateTokens(
      userDetails[0]
    );

    // Store refresh token in DB
    await executeQuery(INSERT_AUTH_TOKEN, [sub, refreshToken, expiry_time]);

    console.log(accessToken);
    await executeQuery("COMMIT");

    // Store tokens in HTTP-only cookies
    res.cookie("access_token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });

    res.redirect("/health");
  } catch (error) {
    await executeQuery("ROLLBACK");
    console.log("loginUser error:", error);
    res.redirect("/auth/google");
  }
};

module.exports = { getGoogleAuthUrl, userRegisterAndLogin };
