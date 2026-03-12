const crypto = require("crypto");

function generatePassword() {
  return crypto.randomBytes(16).toString("hex");
}

function generateAdminUser(slug) {
  return `admin_${slug}`;
}

module.exports = {
  generatePassword,
  generateAdminUser,
};
