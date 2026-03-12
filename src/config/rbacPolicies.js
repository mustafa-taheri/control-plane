const policies = {
  admin: {
    allow: ["*"],
  },

  ml_engineer: {
    allow: [
      "GET:/proxy/*",
      "POST:/proxy/runs",
      "POST:/proxy/pipelines",
      "POST:/proxy/projects",
    ],
  },

  viewer: {
    allow: ["GET:/proxy/*"],
  },
};

module.exports = policies;
