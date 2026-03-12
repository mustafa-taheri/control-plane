const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    action: String,

    method: String,

    endpoint: String,

    statusCode: Number,

    ipAddress: String,

    userAgent: String,

    responseTime: Number,

    metadata: Object,
  },
  { timestamps: true },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
