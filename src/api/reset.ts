import { Response, Request } from "express";
import { config } from "../config.js";
import { reset } from "../db/queries/users.js";
import { UserForbiddenError } from "./errors.js";

export const handleReset = async (req: Request, res: Response) => {
  if (config.api.platform !== "dev") {
    throw new UserForbiddenError("Reset is only allowed in dev environment.");
  }
  config.api.fileserverHits = 0;
  await reset();
  res.write("Hits reset to 0");
  res.end();
};
