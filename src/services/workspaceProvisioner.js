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
  console.log("port ==>", port);

  const containerName = `zenml-${slug}`;
  const adminUsername = generateAdminUser(slug);
  const adminPassword = generatePassword();

  const container = await docker.createContainer({
    Image: "zenmldocker/zenml-server",

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

  console.log("Starting container");

  await container.start();

  const url = `http://localhost:${port}`;

  console.log("Waiting for ZenML server to start");
  console.log("url ==>", url);

  const zenmlWorkspace = await waitForZenML(url);
  console.log("ZenML server started");
  console.log("zenmlWorkspace ==>", zenmlWorkspace);

  const adminToken = await loginAdmin(url, adminUsername, adminPassword);
  console.log("adminToken ==>", adminToken);

  const serviceAccountId = await createServiceAccount(url, adminToken);
  console.log("serviceAccountId ==>", serviceAccountId);

  const apiKey = await createApiKey(url, adminToken, serviceAccountId);
  console.log("apiKey ==>", apiKey);

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
  console.log("workspace ==>", workspace);
  return workspace;
}

module.exports = createWorkspace;
