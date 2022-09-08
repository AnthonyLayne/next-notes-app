const pg = require("pg");

// eslint-disable-next-line import/no-extraneous-dependencies
const { loadEnvConfig } = require("@next/env");

const isDev = process.env.NODE_ENV !== "production";
const { DB_URI, DATABASE } = loadEnvConfig("./", isDev).combinedEnv;

if (DATABASE) pg.defaults.ssl = { rejectUnauthorized: false };

const sharedConfig = {
  client: "pg",
  migrations: { directory: "./data/migrations" },
  seeds: { directory: "./data/seeds" },
};

const config = {
  development: {
    ...sharedConfig,
    connection: process.env.DB_URI,
    seeds: { directory: "./data/seeds" },
  },
  production: {
    ...sharedConfig,
    connection: process.env.DB_URI,
    pool: { min: 2, max: 10 },
  },
};

module.exports = config[process.env.NODE_ENV];
