import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "./auth.js";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "./errors.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UnauthorizedError("invalid username or password");
    }

    const matching = await checkPasswordHash(params.password, user.hashedPassword);
    if (!matching) {
        throw new UnauthorizedError("invalid username or password");
    }

    
    respondWithJSON(res, 200, {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        updatedAt: user.updatedAt
    } satisfies UserResponse);
};

