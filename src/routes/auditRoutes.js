const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWorkspaceLogs,
  getUserLogs,
  getAllLogs,
} = require("../services/auditService");

const router = express.Router();

router.use(authMiddleware);

router.get("/workspace/:workspaceId", async (req, res) => {
  const logs = await getWorkspaceLogs(req.params.workspaceId);

  res.json(logs);
});

router.get("/user/:userId", async (req, res) => {
  const logs = await getUserLogs(req.params.userId);

  res.json(logs);
});

router.get("/", async (req, res) => {
  const logs = await getAllLogs();

  res.json(logs);
});

module.exports = router;
