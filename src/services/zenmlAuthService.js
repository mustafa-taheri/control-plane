const axios = require("axios");
const qs = require("qs");

async function loginAdmin(url, username, password) {
  const response = await axios.post(
    `${url}/api/v1/login`,
    qs.stringify({
      username,
      password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  console.log("response ==>", response);

  return response.data.access_token;
}

module.exports = loginAdmin;
