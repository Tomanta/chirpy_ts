import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";

import type { JwtPayload } from "jsonwebtoken";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hashed_pw: string) {
    return bcrypt.compare(password, hashed_pw)
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000) // get current time in seconds
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign(
        {
            iss: TOKEN_ISSUER,
            sub: userID,
            iat: issuedAt,
            exp: expiresAt
        } satisfies payload,
        secret,
        { algorithm: "HS256" },
    );
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: payload;

    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new UnauthorizedError("Invalid token");
    }

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("Invalid issuer");
    }

    if (!decoded.sub) {
        throw new UnauthorizedError("No user ID in token")
    }

    return decoded.sub;

}