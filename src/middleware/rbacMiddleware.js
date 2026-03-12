const policies = require("../config/rbacPolicies");

function matchRoute(pattern, route) {
  if (pattern === "*") return true;

  if (pattern.endsWith("*")) {
    return route.startsWith(pattern.replace("*", ""));
  }

  return pattern === route;
}

function rbacMiddleware(req, res, next) {
  const role = req.user?.role;

  if (!role) {
    return res.status(403).json({
      error: "Role missing",
    });
  }

  const rolePolicy = policies[role];

  if (!rolePolicy) {
    return res.status(403).json({
      error: "Invalid role",
    });
  }

  const route = `${req.method}:${req.baseUrl}${req.path}`;

  const allowed = rolePolicy.allow.some((p) => matchRoute(p, route));

  if (!allowed) {
    return res.status(403).json({
      error: "Permission denied",
    });
  }

  next();
}

module.exports = rbacMiddleware;
