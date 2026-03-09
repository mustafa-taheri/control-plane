const { createProxyMiddleware } = require("http-proxy-middleware");
const Workspace = require("../models/Workspace");

async function resolveWorkspace(req) {
  const workspaceId = req.user.workspaceId;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return workspace;
}

function zenmlProxy() {
  return async (req, res, next) => {
    try {
      const workspace = await resolveWorkspace(req);

      const proxy = createProxyMiddleware({
        target: workspace.url,

        changeOrigin: true,

        pathRewrite: {
          [`^/proxy/${workspace._id}`]: "",
        },

        onProxyReq: (proxyReq) => {
          if (workspace.serviceAccountToken) {
            proxyReq.setHeader(
              "Authorization",
              `Bearer ${workspace.serviceAccountToken}`,
            );
          }
        },
      });

      proxy(req, res, next);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };
}

module.exports = zenmlProxy;
