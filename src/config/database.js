const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/zenml-control-plane");

  console.log("MongoDB connected");
}

module.exports = connectDB;
