const docker = require("../config/docker");
const Workspace = require("../models/Workspace");
const allocatePort = require("./portAllocator");
const waitForZenML = require("../utils/waitForZenML");
const loginAdmin = require("./zenmlAuthService");
const createServiceAccount = require("./zenmlServiceAccountService");
const createApiKey = require("./zenmlApiKeyService");
const { generateAdminUser, generatePassword } = require("../utils/credentials");

async function createWorkspace(tenantName) {
  const slug = tenantName.toLowerCase().replace(/\s+/g, "-");

  const port = await allocatePort();

  const containerName = `zenml-${slug}`;
  const adminUsername = generateAdminUser(slug);
  const adminPassword = generatePassword();

  const container = await docker.createContainer({
    Image: "zenml/zenml-server",

    name: containerName,

    Env: [
      `ZENML_SERVER_ADMIN_USERNAME=${adminUsername}`,
      `ZENML_SERVER_ADMIN_PASSWORD=${adminPassword}`,
    ],

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

  const adminToken = await loginAdmin(url, adminUsername, adminPassword);

  const serviceAccountId = await createServiceAccount(url, adminToken);

  const apiKey = await createApiKey(url, adminToken, serviceAccountId);

  const workspace = await Workspace.create({
    tenantName,
    slug,
    port,
    url,
    containerName,
    zenmlWorkspace,
    serviceAccountToken: apiKey,
    serviceAccountId,
    status: "running",
  });

  return workspace;
}

module.exports = createWorkspace;
