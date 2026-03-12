const express = require("express");
const login = require("../services/authService");
const { generateToken } = require("../utils/jwt");
const WorkspaceMember = require("../models/WorkspaceMember");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await login(email, password);

    res.json(result);
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
});

router.post("/select-workspace", async (req, res) => {
  try {
    const { userId, workspaceId } = req.body;

    const membership = await WorkspaceMember.findOne({
      userId,
      workspaceId,
    });

    if (!membership) {
      return res.status(403).json({
        error: "User not part of workspace",
      });
    }

    const token = generateToken({
      _id: userId,
      workspaceId,
      role: membership.role,
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
