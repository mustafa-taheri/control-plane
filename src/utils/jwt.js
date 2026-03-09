const jwt = require("jsonwebtoken");

const SECRET = "1c466c737b5306bcb10d820170790";

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      workspaceId: user.workspaceId,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1d" },
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
