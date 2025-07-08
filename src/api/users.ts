import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handleCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await createUser({email: params.email});

    if (!user) {
        throw new Error("Could not create user");
    }
    
    respondWithJSON(res, 201, user);
}