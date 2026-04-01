require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const env = require("../config/env");
const Category = require("../models/Category");
const categories = require("./categories");

const seed = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log(`Seeded ${categories.length} categories`);

    await mongoose.disconnect();
    console.log("Done");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
