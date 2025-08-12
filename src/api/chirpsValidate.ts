import { NextFunction, Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { cleanText } from "./cleanText.js";
import { BadRequestError } from "./errors.js";

export const handlerChirpsValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  type Parameters = { body: string };

  let parameters: Parameters = req.body;

  try {
    const maxChirpLength = 140;
    if (parameters.body.length > maxChirpLength) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }
  } catch (err) {
    next(err);
  }

  const cleanedBody = cleanText(parameters.body);

  respondWithJSON(res, 200, { cleanedBody });
};
