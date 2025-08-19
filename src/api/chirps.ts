import { NextFunction, Request, Response } from "express";
import { validateChirp } from "./chirpsValidate.js";
import { BadRequestError } from "./errors.js";

export const handleCreateChirp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  type Parameters = {
    body: string;
    userId: string;
  };
  const parameters: Parameters = req.body;
  let cleantedChirp = "";
  try {
    cleantedChirp = await validateChirp(parameters.body);
  } catch (err) {
    next(err);
  }
};
