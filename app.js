const express = require("express");

const connectDB = require("./src/config/database");

const workspaceRoutes = require("./src/routes/workspaceRoutes");
const proxyRoutes = require("./src/routes/proxyRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(express.json());
connectDB();
app.use("/auth", authRoutes);

app.use("/workspaces", workspaceRoutes);

app.use("/proxy", proxyRoutes);

app.listen(4000, () => {
  console.log("Control Plane running on port 4000");
});
