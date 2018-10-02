const withTypescript = require("@zeit/next-typescript");

module.exports = withTypescript({
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_SUBSCRIPTION_ENDPOINT: process.env.API_SUBSCRIPTION_ENDPOINT
  }
});
