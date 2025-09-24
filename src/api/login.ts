import { Request, Response } from "express";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPassword, makeJWT } from "../utils/auth.js";
import { respondWithJSON } from "./json.js";
import { toPublicUser } from "../utils/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { PublicUser } from "src/db/schema/users.js";

type LoginResponse = PublicUser & {
  token: string;
};

export const handleLogin = async (req: Request, res: Response) => {
  type Parameters = {
    password: string;
    email: string;
    expiresInSeconds?: number;
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

  const expiresInSeconds = params.expiresInSeconds
    ? Math.min(params.expiresInSeconds, config.api.jwtExpiresInSeconds)
    : config.api.jwtExpiresInSeconds;

  const token = makeJWT(user.id, expiresInSeconds, config.api.jwtSecret);

  const safeUser = toPublicUser(user);

  respondWithJSON(res, 200, { ...safeUser, token } satisfies LoginResponse);
};
