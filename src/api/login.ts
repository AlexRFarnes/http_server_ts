import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { users } from "./../db/schema/users.js";
import { db } from "../db/index.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPassword } from "../utils/auth.js";
import { respondWithJSON } from "./json.js";
import { toPublicUser } from "../utils/auth.js";

export const handleLogin = async (req: Request, res: Response) => {
  type Parameters = {
    password: string;
    email: string;
  };

  const params: Parameters = req.body;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, params.email))
    .limit(1);

  const user = result[0] ?? null;

  const isValidPassword = await checkPassword(
    params.password,
    user.hashedPassword
  );

  if (!user || !isValidPassword) {
    throw new UserNotAuthenticatedError(
      "Please verify your email and password"
    );
  }

  const safeUser = toPublicUser(user);

  respondWithJSON(res, 200, { ...safeUser });
};
