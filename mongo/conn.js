"use strict";
const mongoose = require("mongoose");

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDB", err);
  });
