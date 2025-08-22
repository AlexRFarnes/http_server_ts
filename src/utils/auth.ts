import bcrypt from "bcrypt";
import { NewUser, PublicUser } from "../db/schema/users.js";

const SALT_ROUNDS = 10;

export const toPublicUser = (user: NewUser): PublicUser => {
  const { hashedPassword, ...rest } = user;
  return rest;
};

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
};

export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
