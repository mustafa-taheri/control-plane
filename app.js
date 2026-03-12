const express = require("express");

const connectDB = require("./src/config/database");

const workspaceRoutes = require("./src/routes/workspaceRoutes");
const workspaceUserRoutes = require("./src/routes/workspaceUserRoutes");
const proxyRoutes = require("./src/routes/proxyRoutes");
const authRoutes = require("./src/routes/authRoutes");
const auditMiddleware = require("./src/middleware/auditMiddleware");
const auditRoutes = require("./src/routes/auditRoutes");

const app = express();

app.use(auditMiddleware);
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);

app.use("/workspaces", workspaceRoutes);

app.use("/workspace-users", workspaceUserRoutes);

app.use("/proxy", proxyRoutes);

app.use("/audit", auditRoutes);

app.listen(4000, () => {
  console.log("Control Plane running on port 4000");
});
