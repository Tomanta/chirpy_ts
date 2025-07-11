import bcrypt from "bcrypt"


export async function hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hashed_pw: string) {
    return bcrypt.compare(password, hashed_pw)
}