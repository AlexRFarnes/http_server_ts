import { Response, Request } from "express";
import { config } from "../config.js";

export const handleReset = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.write("Hits reset to 0");
  res.end();
};
