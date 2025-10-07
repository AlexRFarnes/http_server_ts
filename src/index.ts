import postgres from "postgres";
import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerReadiness } from "./api/readiness.js";
import { handleMetrics } from "./api/metrics.js";
import { handleReset } from "./api/reset.js";
import {
  handleCreateChirp,
  handleGetChirps,
  handleGetChirp,
} from "./api/chirps.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  errorHandler,
} from "./api/middleware.js";
import { config } from "./config.js";
import { handleCreateUser } from "./api/users.js";
import { handleLogin } from "./api/login.js";
import { handleRefresh, handleRevoke } from "./api/refreshTokens.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handleMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handleReset(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handleLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handleRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handleRevoke(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handleCreateUser(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handleGetChirp(req, res).catch(next));
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handleGetChirps(req, res).catch(next));
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handleCreateChirp(req, res)).catch(next);
});

app.use(errorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
