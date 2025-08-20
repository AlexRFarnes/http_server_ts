export const cleanText = (text: string) => {
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  return text
    .split(" ")
    .map(word =>
      profaneWords.includes(word.toLocaleLowerCase()) ? "****" : word
    )
    .join(" ");
};
