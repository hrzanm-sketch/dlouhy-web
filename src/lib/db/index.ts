import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://dt:dt_local_dev@localhost:5432/dt_intranet"

const client = postgres(connectionString, { max: 5 })
export const db = drizzle(client, { schema })
