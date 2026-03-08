const express = require("express");
const createWorkspace = require("../services/workspaceProvisioner");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await createWorkspace(name);

    res.json(workspace);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
