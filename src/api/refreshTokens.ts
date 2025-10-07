import { Request, Response } from "express";
import { getBearerToken } from "../utils/auth.js";
import {
  getRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refreshTokens.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { makeJWT } from "../utils/auth.js";
import { config } from "../config.js";
import { respondWithJSON } from "./json.js";

export const handleRefresh = async (req: Request, res: Response) => {
  const token = getBearerToken(req);

  const refreshToken = await getRefreshToken(token);

  if (!refreshToken) {
    throw new UserNotAuthenticatedError("Invalid refresh token");
  }

  if (refreshToken.revokedAt) {
    throw new UserNotAuthenticatedError("Refresh token revoked");
  }

  if (refreshToken.expiresAt < new Date()) {
    throw new UserNotAuthenticatedError("Refresh token expired");
  }

  const jwtToken = makeJWT(
    refreshToken.userId,
    config.api.jwtExpiresInSeconds,
    config.api.jwtSecret
  );

  respondWithJSON(res, 200, { token: jwtToken });
};

export const handleRevoke = async (req: Request, res: Response) => {
  const token = getBearerToken(req);

  const refreshToken = await getRefreshToken(token);

  if (!refreshToken) {
    throw new UserNotAuthenticatedError("Invalid refresh token");
  }

  await revokeRefreshToken(token);

  res.status(204).end();
};
