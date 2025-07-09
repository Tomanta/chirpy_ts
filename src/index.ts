import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handleCreateUser } from "./api/users.js";
import { middlewareLogResponses, middlewareMetricsInc, errorMiddleware } from "./api/middleware.js";
import { handleCreateChirp } from "./api/chirps.js";
import { config } from "./config.js";

const migrationClient= postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json()); // automatically parse JSON body responses
app.get("/admin/metrics", (req, res, next) => {Promise.resolve(handlerMetrics(req, res)).catch(next) });
app.post("/admin/reset", (req, res, next) => {Promise.resolve(handlerReset(req, res)).catch(next) });
app.get("/api/healthz", (req, res, next) => {Promise.resolve(handlerReadiness(req, res)).catch(next) });
app.post("/api/chirps", (req, res, next) => {Promise.resolve(handleCreateChirp(req, res)).catch(next) });
app.post("/api/users", (req, res, next) => {Promise.resolve(handleCreateUser(req, res)).catch(next) });
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(errorMiddleware);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});