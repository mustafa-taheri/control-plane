const docker = require("../config/docker");
const Workspace = require("../models/Workspace");
const allocatePort = require("./portAllocator");
const waitForZenML = require("../utils/waitForZenML");

async function createWorkspace(tenantName) {
  const slug = tenantName.toLowerCase().replace(/\s+/g, "-");

  const port = await allocatePort();

  const containerName = `zenml-${slug}`;

  const container = await docker.createContainer({
    Image: "zenml/zenml-server",

    name: containerName,

    ExposedPorts: {
      "8080/tcp": {},
    },

    HostConfig: {
      PortBindings: {
        "8080/tcp": [{ HostPort: port.toString() }],
      },
    },
  });

  await container.start();

  const url = `http://localhost:${port}`;

  const zenmlWorkspace = await waitForZenML(url);

  const workspace = await Workspace.create({
    tenantName,
    slug,
    port,
    url,
    containerName,
    zenmlWorkspace,
    status: "running",
  });

  return workspace;
}

module.exports = createWorkspace;
