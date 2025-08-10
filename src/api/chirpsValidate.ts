import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { cleanText } from "./cleanText.js";

export const handlerChirpsValidate = (req: Request, res: Response) => {
  type Parameters = { body: string };

  let parameters: Parameters;

  try {
    parameters = req.body;
  } catch (error) {
    respondWithError(res, 400, "Invalid JSON");
    return;
  }

  const maxChirpLength = 140;
  if (parameters.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  const cleanedBody = cleanText(parameters.body);

  respondWithJSON(res, 200, { cleanedBody });
};
