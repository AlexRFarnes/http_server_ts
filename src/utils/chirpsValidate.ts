import { cleanText } from "./cleanText.js";
import { BadRequestError } from "../api/errors.js";

export const validateChirp = (text: string): string => {
  const maxChirpLength = 140;
  if (text.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = cleanText(text);

  return cleanedBody;
};
