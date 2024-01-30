/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  reactStrictMode: false,

  env: {
    PACKAGE_ID: process.env.PACKAGE_ID || "",
    CONFIGURATION_OBJECT_IDS: process.env.CONFIGURATION_OBJECT_IDS || "",
    STATE_OBJECT_IDS: process.env.STATE_OBJECT_IDS || "",
    CUSTODIAN_OBJECT_IDS: process.env.CUSTODIAN_OBJECT_IDS || "",
    PAIR_PACKAGE_ID: process.env.PAIR_PACKAGE_ID || "",
    TOKEN_DECIMAL: process.env.TOKEN_DECIMAL || "",
    POOL_TYPES: process.env.POOL_TYPES || "",
    PRICE_FEED_ID: process.env.PRICE_FEED_ID || "",

    PRIVATE_KEY: process.env.PRIVATE_KEY,
  },
};

module.exports = nextConfig;
