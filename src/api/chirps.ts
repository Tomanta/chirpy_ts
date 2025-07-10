import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getChirps, getChirpByID } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields");
    }

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    const badWords = ["kerfuffle","sharbert","fornax"];
    const cleanedBody = getCleanedBody(params.body, badWords);

    const chirp = await createChirp({body: cleanedBody, userId: params.userId});

    if (!chirp) {
        throw new Error("Cound not create chirp");
    }
    
    respondWithJSON(res, 201, chirp)
}

function getCleanedBody(body: string, badWords: string[]): string {
    const words = body.split(" ");

    const replacementWord = "****";

    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = replacementWord;
        }
    }
    const cleaned = words.join(" ");
    return cleaned;
  
}

export async function handlerGetChirps(req: Request, res: Response) {
    const chirps = await getChirps();

    respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirpByID(req: Request, res: Response) {
    if (!req.params.id) {
        throw new BadRequestError("Missing ID");
    }

    const result = await getChirpByID(req.params.id);
    if (!result) {
        throw new NotFoundError("Chirp not found");
    }
    
    respondWithJSON(res, 200, result);
}