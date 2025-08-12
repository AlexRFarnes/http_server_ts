import { NextFunction, Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { cleanText } from "./cleanText.js";

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
      throw Error("Chirp is too long");
    }
  } catch (err) {
    next(err);
  }

  const cleanedBody = cleanText(parameters.body);

  respondWithJSON(res, 200, { cleanedBody });
};
