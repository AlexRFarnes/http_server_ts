import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handleMetrics } from "./api/metrics.js";
import { handleReset } from "./api/reset.js";
import { handlerChirpsValidate } from "./api/chirpsValidate.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpsValidate);
app.get("/admin/metrics", handleMetrics);
app.post("/admin/reset", handleReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
