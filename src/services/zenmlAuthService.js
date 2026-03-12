const axios = require("axios");

async function loginAdmin(url, username, password) {
  const response = await axios.post(`${url}/api/v1/login`, {
    username,
    password,
  });

  return response.data.access_token;
}

module.exports = loginAdmin;
