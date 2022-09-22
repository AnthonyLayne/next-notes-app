import { loadEnvConfig } from "@next/env"; // eslint-disable-line import/no-extraneous-dependencies

export const getEnvVar = (envVar: string) => {
  const isDev = process.env.NODE_ENV !== "production";
  const vars = loadEnvConfig("./", isDev).combinedEnv;
  const result = vars[envVar];

  if (!result) throw new Error(`Missing env var: ${envVar}`);
  return result;
};
