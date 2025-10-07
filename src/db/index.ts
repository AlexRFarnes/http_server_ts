import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as usersSchema from "./schema/schema.js";
import * as chirpsSchema from "./schema/schema.js";
import { config } from "../config.js";

const schema = {
  ...usersSchema,
  ...chirpsSchema,
};

const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema });
