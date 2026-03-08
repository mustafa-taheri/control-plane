const axios = require("axios");

async function waitForZenML(url) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await axios.get(`${url}/api/v1/info`);

      if (res.data?.name) {
        return res.data.name;
      }
    } catch (err) {}

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("ZenML server did not start");
}

module.exports = waitForZenML;
