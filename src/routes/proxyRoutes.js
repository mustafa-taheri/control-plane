const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const zenmlProxy = require("../services/proxyService");

const router = express.Router();

router.use(authMiddleware);

router.use(rbacMiddleware);

router.use("/*", zenmlProxy());

module.exports = router;
