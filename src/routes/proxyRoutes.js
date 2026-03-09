const express = require("express");
const zenmlProxy = require("../services/proxyService");

const router = express.Router();

router.use("/:workspaceId/*", zenmlProxy());

module.exports = router;
