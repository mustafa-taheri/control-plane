const Workspace = require("../models/Workspace");

async function allocatePort() {
  const lastWorkspace = await Workspace.findOne().sort({ port: -1 });

  if (!lastWorkspace) return 8080;

  return lastWorkspace.port + 10;
}

module.exports = allocatePort;
