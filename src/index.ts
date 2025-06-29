import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});