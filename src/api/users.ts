import { Request, Response } from "express";
import { NewUser } from "src/db/schema";
import { createUser } from "src/db/queries/users";

export const handleCreateUser = (req: Request, res: Response) => {
  let email = req.body.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  let newUser = createUser({ email });

  return res.status(401).json({ ...newUser });
};
