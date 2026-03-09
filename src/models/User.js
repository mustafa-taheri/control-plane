const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,

    passwordHash: String,

    authProvider: {
      type: String,
      enum: ["local", "entra"],
      default: "local",
    },

    externalId: String,

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
