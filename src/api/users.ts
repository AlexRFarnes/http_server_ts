import { Request, Response } from "express";
import { toPublicUser } from "../utils/auth.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../utils/auth.js";

export const handleCreateUser = async (req: Request, res: Response) => {
  type parameteres = {
    email: string;
    password: string;
  };

  const params: parameteres = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required email field.");
  }

  if (!params.password) {
    throw new BadRequestError("Missing required password field.");
  }

  const hash = await hashPassword(params.password);

  const newUser = await createUser({
    email: params.email,
    hashedPassword: hash,
  });

  const safeUser = toPublicUser(newUser);

  respondWithJSON(res, 201, { ...safeUser });
};
