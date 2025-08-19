import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handleMetrics } from "./api/metrics.js";
import { handleReset } from "./api/reset.js";
import { handleCreateChirp } from "./api/chirps.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
  errorHanlder,
} from "./api/middleware.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handleCreateUser } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handleMetrics);
app.post("/admin/reset", handleReset);
app.post("/api/users", handleCreateUser);
app.post("/api/chirps", handleCreateChirp);

app.use(errorHanlder);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
