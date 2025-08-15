process.loadEnvFile();

import type { MigrationConfig } from "drizzle-orm/migrator";

const envOrThrow = (key: string): string => {
  if (process.env[key] === undefined)
    throw new Error(
      `Environment variable ${key} is missing. Please set it in your .env file.`
    );
  else return process.env[key] as string;
};

type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
};
