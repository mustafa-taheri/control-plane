const axios = require("axios");

async function createAdminUser(url, email, password) {
  const response = await axios.post(`${url}/api/v1/users`, {
    name: "Admin User",
    email: email,
    password: password,
    is_admin: true,
  });

  return response.data.id;
}

module.exports = createAdminUser;
