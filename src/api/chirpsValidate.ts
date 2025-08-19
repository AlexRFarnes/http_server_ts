import { cleanText } from "./cleanText.js";
import { BadRequestError } from "./errors.js";

export const validateChirp = async (text: string) => {
  const maxChirpLength = 140;
  if (text.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = cleanText(text);

  return cleanedBody;
};
