import { defineConfig } from "drizzle-kit";
import { configDotenv } from "@dotenvx/dotenvx";

configDotenv({ path: ".env.local", override: true });

const drizzleConfig = defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations",
  dialect: "turso",
  dbCredentials: {
    // TODO: Remove `!` and make env typesafe with zod.
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  strict: true,
  verbose: true,
});

export default drizzleConfig;
