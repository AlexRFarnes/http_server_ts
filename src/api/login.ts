import { Request, Response } from "express";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPassword, makeJWT } from "../utils/auth.js";
import { respondWithJSON } from "./json.js";
import { toPublicUser } from "../utils/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { PublicUser } from "../db/schema/schema.js";
import { makeRefreshToken } from "../utils/auth.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

type LoginResponse = PublicUser & {
  token: string;
  refreshToken: string;
};

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

  const expiresInSeconds = config.api.jwtExpiresInSeconds;

  const token = makeJWT(user.id, expiresInSeconds, config.api.jwtSecret);

  const rawToken = makeRefreshToken();

  const refreshToken = await createRefreshToken({
    token: rawToken,
    expiresAt: new Date(
      Date.now() + config.api.refreshTokenExpiresInSeconds * 1000
    ), // 60 days later in milliseconds
    userId: user.id,
    revokedAt: null,
  });

  const safeUser = toPublicUser(user);

  respondWithJSON(res, 200, {
    ...safeUser,
    token,
    refreshToken: refreshToken.token,
  } satisfies LoginResponse);
};
