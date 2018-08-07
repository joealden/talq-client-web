const withTypescript = require("@zeit/next-typescript");
const nextRuntimeDotenv = require("next-runtime-dotenv");

const withConfig = nextRuntimeDotenv({
  path: ".env",
  public: ["API_ENDPOINT", "API_SUBSCRIPTION_ENDPOINT"],
  server: ["PORT"]
});

module.exports = withConfig(withTypescript());
