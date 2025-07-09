import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handleCreateChirp(req: Request, res: Response) {
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

    const words = params.body.split(" ");

    const badWords = ["kerfuffle","sharbert","fornax"];
    const replacementWord = "****";

    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = replacementWord;
        }
    }
    const cleanedWords = words.join(" ");

    const chirp = await createChirp({body: cleanedWords, userId: params.userId});

    if (!chirp) {
        throw new Error("Cound not create chirp");
    }
    
    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.createdAt,
        body: chirp.body,
        userId: chirp.userId,
    })
}
