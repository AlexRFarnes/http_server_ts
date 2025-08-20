import { Request, Response, NextFunction } from "express";
import { validateChirp } from "../utils/chirpsValidate.js";
import { createChirp } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";

export const handleCreateChirp = async (req: Request, res: Response) => {
  type Parameters = {
    body: string;
    userId: string;
  };
  const params: Parameters = req.body;
  const cleantedChirp = validateChirp(params.body);

  const newChirp = await createChirp({
    body: cleantedChirp,
    userId: params.userId,
  });

  respondWithJSON(res, 201, { ...newChirp });
};
