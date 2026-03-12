const axios = require("axios");

async function createZenmlUser(url, adminToken, email) {
  const response = await axios.post(
    `${url}/api/v1/users`,
    {
      name: email,
      email: email,
    },
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    },
  );

  return response.data.id;
}

module.exports = createZenmlUser;
