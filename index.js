require("dotenv").config();

const app = require("./app");
const { dbConnect } = require("./db-connect");

const startServer = async function () {
  try {
    dbConnect();
    app.listen(process.env.SERVER_PORT);
    console.log(`--- Server started on ${process.env.SERVER_PORT} ---\n\n`);
  } catch (error) {
    console.log("server setup failed", error);
    console.log("Error: ", error.message);
  }
};

startServer();
