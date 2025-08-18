import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";

export const handleCreateUser = async (req: Request, res: Response) => {
  type parameteres = {
    email: string;
  };
  const params: parameteres = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required email field");
  }

  const newUser = await createUser({ email: params.email });

  respondWithJSON(res, 201, { ...newUser });
};
