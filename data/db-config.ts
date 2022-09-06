import knex from "knex";
import dotenv from "dotenv";

import config from "./knexfile";

const VALID_ENVS = ["development", "production"] as const;

dotenv.config();

const environment = process.env.NODE_ENV;

if (!VALID_ENVS.includes((environment || "") as typeof VALID_ENVS[number])) {
  throw new Error("Received invalid `NODE_ENV` value.");
}

// TODO: Add generic types to `knex` or, even better, do what's described here:
// TODO: https://knexjs.org/guide/#typescript
const db = knex(config[environment as typeof VALID_ENVS[number]]);

export default db;
