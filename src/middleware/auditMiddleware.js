const AuditLog = require("../models/AuditLog");

async function auditMiddleware(req, res, next) {
  const start = Date.now();

  const originalSend = res.send;

  res.send = async function (body) {
    const responseTime = Date.now() - start;

    try {
      await AuditLog.create({
        userId: req.user?.userId || null,

        workspaceId: req.user?.workspaceId || null,

        action: `${req.method} ${req.path}`,

        method: req.method,

        endpoint: req.originalUrl,

        statusCode: res.statusCode,

        ipAddress: req.ip,

        userAgent: req.headers["user-agent"],

        responseTime,
      });
    } catch (err) {
      console.error("Audit log error:", err.message);
    }

    originalSend.call(this, body);
  };

  next();
}

module.exports = auditMiddleware;
