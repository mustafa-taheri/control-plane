const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    tenantName: { type: String, required: true },
    slug: { type: String, required: true },

    port: { type: Number, required: true },
    url: { type: String, required: true },

    containerName: { type: String, required: true },

    zenmlWorkspace: { type: String },

    status: {
      type: String,
      enum: ["starting", "running", "failed"],
      default: "starting",
    },
    serviceAccountToken: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workspace", workspaceSchema);
