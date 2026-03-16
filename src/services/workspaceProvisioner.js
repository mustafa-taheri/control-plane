const docker = require("../config/docker");
const Workspace = require("../models/Workspace");
const allocatePort = require("./portAllocator");
const waitForZenML = require("../utils/waitForZenML");
const loginAdmin = require("./zenmlAuthService");
const createServiceAccount = require("./zenmlServiceAccountService");
const createApiKey = require("./zenmlApiKeyService");
const { generateAdminUser, generatePassword } = require("../utils/credentials");
const createAdminUser = require("./createAdminUser");

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

    // Env: [
    //   `ZENML_DEFAULT_USER_NAME=${adminUsername}`,
    //   `ZENML_DEFAULT_USER_PASSWORD=${adminPassword}`,
    // ],

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

  // const adminUserId = await createAdminUser(url, adminUsername, adminPassword);
  // console.log("adminUserId ==>", adminUserId);

  // const adminToken = await loginAdmin(url, adminUsername, adminPassword);
  // console.log("adminToken ==>", adminToken);

  const { adminUserId, adminToken } = await bootstrapAdminUser(
    url,
    adminUsername,
    adminPassword,
  );

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

async function bootstrapAdminUser(url, adminUsername, adminPassword) {
  for (let i = 0; i < 20; i++) {
    try {
      const adminUserId = await createAdminUser(
        url,
        adminUsername,
        adminPassword,
      );
      console.log("adminUserId ==>", adminUserId);
      const adminToken = await loginAdmin(url, adminUsername, adminPassword);
      console.log("adminToken ==>", adminToken);
      return { adminUserId, adminToken };
    } catch (error) {
      console.error("Error creating admin user:", error.message);
    }
  }
}

module.exports = createWorkspace;
