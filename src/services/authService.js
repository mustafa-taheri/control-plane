// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const { generateToken } = require("../utils/jwt");

// async function login(email, password) {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const valid = await bcrypt.compare(password, user.password);

//   if (!valid) {
//     throw new Error("Invalid credentials");
//   }

//   const token = generateToken(user);

//   return {
//     token,
//     user,
//   };
// }

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { getUserWorkspaces } = require("./workspaceMemberService");

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const workspaces = await getUserWorkspaces(user._id);

  return {
    user,
    workspaces,
  };
}

module.exports = login;
