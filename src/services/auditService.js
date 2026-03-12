const AuditLog = require("../models/AuditLog");

async function getWorkspaceLogs(workspaceId, limit = 100) {
  return AuditLog.find({ workspaceId }).sort({ createdAt: -1 }).limit(limit);
}

async function getUserLogs(userId, limit = 100) {
  return AuditLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
}

async function getAllLogs(limit = 100) {
  return AuditLog.find().sort({ createdAt: -1 }).limit(limit);
}

module.exports = {
  getWorkspaceLogs,
  getUserLogs,
  getAllLogs,
};
