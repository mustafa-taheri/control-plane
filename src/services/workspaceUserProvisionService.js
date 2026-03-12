const Workspace = require("../models/Workspace");
const User = require("../models/User");
const WorkspaceMember = require("../models/WorkspaceMember");

const loginAdmin = require("./zenmlAuthService");
const createZenmlUser = require("./zenmlUserService");

async function addUserToWorkspace(workspaceId, email, role) {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
    });
  }

  const adminToken = await loginAdmin(
    workspace.url,
    workspace.adminUsername,
    workspace.adminPassword,
  );

  const zenmlUserId = await createZenmlUser(workspace.url, adminToken, email);

  const membership = await WorkspaceMember.create({
    userId: user._id,
    workspaceId,
    role,
    zenmlUserId,
  });

  return membership;
}

module.exports = addUserToWorkspace;
