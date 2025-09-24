import { Request, Response } from "express";
import { validateChirp } from "../utils/chirpsValidate.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
import { NotFoundError } from "./errors.js";
import { getBearerToken, validateJWT } from "../utils/auth.js";
import { config } from "../config.js";

export const handleCreateChirp = async (req: Request, res: Response) => {
  type Parameters = {
    body: string;
    userId: string;
  };
  const params: Parameters = req.body;
  const cleantedChirp = validateChirp(params.body);

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.jwtSecret);

  const newChirp = await createChirp({
    body: cleantedChirp,
    userId: userId,
  });

  respondWithJSON(res, 201, { ...newChirp });
};

export const handleGetChirps = async (req: Request, res: Response) => {
  const result = await getAllChirps();
  respondWithJSON(res, 200, result);
};

export async function handleGetChirp(req: Request, res: Response) {
  const { chirpId } = req.params;
  const result = await getChirp(chirpId);

  if (!result) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }

  respondWithJSON(res, 200, result);
}
