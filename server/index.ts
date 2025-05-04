import * as dotenv from 'dotenv';
dotenv.config(); // this looks for `.env`, etc. at the root

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';


if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error("Missing DRIZZLE_DATABASE_URL in environment variables");
}

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle({ client: sql, schema, logger: true });

