const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
    },

    zenmlUserId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkspaceMember", schema);
