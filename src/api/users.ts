import { Request, Response } from "express";
import { toPublicUser } from "../utils/auth.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../utils/auth.js";
import { getBearerToken } from "../utils/auth.js";
import { validateJWT } from "../utils/auth.js";
import { config } from "../config.js";
import { updateUser } from "../db/queries/users.js";

export const handleCreateUser = async (req: Request, res: Response) => {
  type parameteres = {
    email: string;
    password: string;
  };

  const params: parameteres = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const newUser = await createUser({
    email: params.email,
    hashedPassword,
  });

  const safeUser = toPublicUser(newUser);

  respondWithJSON(res, 201, { ...safeUser });
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.jwtSecret);

  const hashedPassword = await hashPassword(params.password);

  const updatedUser = await updateUser(userId, {
    email: params.email,
    hashedPassword,
  });
  const safeUser = toPublicUser(updatedUser);

  respondWithJSON(res, 200, { ...safeUser });
};
