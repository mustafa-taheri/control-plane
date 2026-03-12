const express = require("express");

const addUserToWorkspace = require("../services/workspaceUserProvisioner");

const router = express.Router();

router.post("/:workspaceId/users", async (req, res) => {
  try {
    const { email, role } = req.body;

    const membership = await addUserToWorkspace(
      req.params.workspaceId,
      email,
      role,
    );

    res.json(membership);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
