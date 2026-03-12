const axios = require("axios");

async function createServiceAccount(url, token) {
  const response = await axios.post(
    `${url}/api/v1/service_accounts`,
    {
      name: "control-plane",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.id;
}

module.exports = createServiceAccount;
