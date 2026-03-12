const WorkspaceMember = require("../models/WorkspaceMember");
const Workspace = require("../models/Workspace");

async function getUserWorkspaces(userId) {
  const memberships = await WorkspaceMember.find({ userId }).populate(
    "workspaceId",
  );

  return memberships.map((m) => ({
    id: m.workspaceId._id,
    name: m.workspaceId.tenantName,
    role: m.role,
  }));
}

module.exports = { getUserWorkspaces };
