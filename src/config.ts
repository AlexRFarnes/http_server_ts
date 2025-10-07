process.loadEnvFile();

import type { MigrationConfig } from "drizzle-orm/migrator";

const envOrThrow = (key: string): string => {
  if (process.env[key] === undefined)
    throw new Error(
      `Environment variable ${key} is missing. Please set it in your .env file.`
    );
  else return process.env[key] as string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  platform: string;
  port: number;
  jwtSecret: string;
  jwtExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    port: Number(envOrThrow("PORT")),
    jwtSecret: envOrThrow("JWT_SECRET"),
    jwtExpiresInSeconds: Number(envOrThrow("JWT_EXPIRES_IN_SECONDS")),
    refreshTokenExpiresInSeconds: Number(
      envOrThrow("REFRESH_TOKEN_EXPIRES_IN_SECONDS")
    ),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
};
