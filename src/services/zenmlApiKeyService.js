const axios = require("axios");

async function createApiKey(url, token, serviceAccountId) {
  const response = await axios.post(
    `${url}/api/v1/api_keys`,
    {
      service_account_id: serviceAccountId,
      name: "control-plane-key",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.key;
}

module.exports = createApiKey;
