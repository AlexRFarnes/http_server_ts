import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
  UserNotAuthenticatedError,
} from "./errors.js";

export const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
};

export const middlewareMetricsInc = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.api.fileserverHits++;

  next();
};

export const errorHanlder = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BadRequestError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof UserNotAuthenticatedError) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof UserForbiddenError) {
    return res.status(403).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  console.log(err);
  return res.status(500).json({ error: "Something went wrong" });
};
