const express = require("express");
const login = require("../services/authService");

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

module.exports = router;
