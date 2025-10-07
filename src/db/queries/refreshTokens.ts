import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewToken, refreshTokens } from "../schema/schema.js";

export async function createRefreshToken(token: NewToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(token)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getRefreshToken(token: string) {
  const [result] = await db
    .select({
      token: refreshTokens.token,
      userId: refreshTokens.userId,
      expiresAt: refreshTokens.expiresAt,
      revokedAt: refreshTokens.revokedAt,
    })
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result ?? null;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}
