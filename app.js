const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");

app.use(bodyParser.json());

//IMPORT ROUTES
const authRoute = require("./routes/Auth");
app.use("/api/user/", authRoute);

// ROUTES
app.get("/", (req, res) => {
  res.send("You are on home of JWT BASED AUTH");
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("Connected to database")
);

app.listen(3000, () => console.log("Server started"));
