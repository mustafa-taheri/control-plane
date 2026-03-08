const express = require("express");

const connectDB = require("./config/database");

const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/workspaces", workspaceRoutes);

app.listen(4000, () => {
  console.log("Control Plane running on port 4000");
});
