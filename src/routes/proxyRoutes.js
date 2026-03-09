const express = require("express");
const zenmlProxy = require("../services/proxyService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.use("/*", zenmlProxy());

module.exports = router;
