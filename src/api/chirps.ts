import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handleValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

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

    respondWithJSON(res, 200, {
            cleanedBody: cleanedWords,
    });

}
