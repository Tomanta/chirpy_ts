import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import type { NewUser } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({email: params.email, hashedPassword: hashedPassword} satisfies NewUser);

    if (!user) {
        throw new Error("Could not create user");
    }
    
    respondWithJSON(res, 201, {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        updatedAt: user.updatedAt
    } satisfies UserResponse);
}