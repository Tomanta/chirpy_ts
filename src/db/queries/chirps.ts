import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function resetChirps() {
  await db.delete(chirps);
}

export async function getChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(chirps.createdAt);
    return result
}

export async function getChirpByID(id: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id))
    return result
}