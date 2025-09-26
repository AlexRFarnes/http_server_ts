import bcrypt from "bcrypt";
import { NewUser, PublicUser } from "../db/schema/schema.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { UserNotAuthenticatedError } from "../api/errors.js";
import { Request } from "express";
import crypto from "crypto";
const SALT_ROUNDS = 10;
const TOKEN_ISSUER = "chirpy";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function toPublicUser(user: NewUser): PublicUser {
  const { hashedPassword, ...rest } = user;
  return rest;
}

export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

export async function checkPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function makeJWT(
  userId: string,
  expiresIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000); // time in seconds
  const expiresAt = issuedAt + expiresIn;
  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userId,
    iat: issuedAt,
    exp: expiresAt,
  };
  const token = jwt.sign(payload, secret, { algorithm: "HS256" });

  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret) as Payload;
  } catch (err) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("No user ID in token");
  }
  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new UserNotAuthenticatedError("No authorization header");
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    throw new UserNotAuthenticatedError("Invalid authorization type");
  }
  return token.trim();
}

export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
