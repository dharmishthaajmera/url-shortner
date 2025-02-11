const { executeQuery } = require("../../db-connect");
const { GET_ALIAS_FOR_USER } = require("../helpers/queries");

// Middleware to check if the authenticated user owns the alias
const checkAliasOwnership = async (req, res, next) => {
  const { alias } = req.params;

  // Check if the user is authenticated
  const user = req.user.userId;

  if (!user) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    // Fetch the URLs for the authenticated user
    const userUrls = await executeQuery(GET_ALIAS_FOR_USER, [user.id]);

    // Extract aliases from the user URLs
    const userAliases = userUrls.map((url) => url.alias);

    // Check if the alias is in the user's URLs
    if (!userAliases.includes(alias)) {
      return res.status(403).json({
        error:
          "Forbidden. You do not have permission to access this URL's analytics.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in alias ownership check:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { checkAliasOwnership };
