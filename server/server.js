const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start();
