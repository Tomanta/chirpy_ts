import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc, errorMiddleware } from "./api/middleware.js";
import { handleValidateChirp } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json()); // automatically parse JSON body responses
app.get("/admin/metrics", (req, res, next) => {Promise.resolve(handlerMetrics(req, res)).catch(next) });
app.post("/admin/reset", (req, res, next) => {Promise.resolve(handlerReset(req, res)).catch(next) });

app.get("/api/healthz", (req, res, next) => {Promise.resolve(handlerReadiness(req, res)).catch(next) });
app.post("/api/validate_chirp", (req, res, next) => {Promise.resolve(handleValidateChirp(req, res)).catch(next) });
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});