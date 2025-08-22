import { Request, Response } from "express";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPassword } from "../utils/auth.js";
import { respondWithJSON } from "./json.js";
import { toPublicUser } from "../utils/auth.js";
import { getUserByEmail } from "../db/queries/users.js";

export const handleLogin = async (req: Request, res: Response) => {
  type Parameters = {
    password: string;
    email: string;
  };

  const params: Parameters = req.body;

  const user = await getUserByEmail(params.email);

  if (!user) {
    throw new UserNotAuthenticatedError("Invalid email or password");
  }

  const passwordMatches = await checkPassword(
    params.password,
    user.hashedPassword
  );

  if (!passwordMatches) {
    throw new UserNotAuthenticatedError("Invalid email or password");
  }

  const safeUser = toPublicUser(user);

  respondWithJSON(res, 200, { ...safeUser });
};
