import { loadEnvFile, env } from "process";

loadEnvFile();

function envOrThrow(key: string) {
    if (!env[key]) {
        throw new Error(`Config key does not exist: ${key}`);
    }
    return env[key];
}

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("dbUrl"),
}