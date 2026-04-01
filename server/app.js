const express = require("express");
const cors = require("cors");
const app = express();

// setup middlewares

app.use(express.json());
app.use(cors());

app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to snapsell" });
});
module.exports = app;
