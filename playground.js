require("dotenv").config();

const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

const clearDB = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing in your .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database");

    // add your delete logic here
    // example:
    await mongoose.connection.db.dropDatabase();

    console.log("Database task completed");
  } catch (error) {
    console.error("Database error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

clearDB();
