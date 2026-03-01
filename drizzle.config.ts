import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://dt:dt_local_dev@localhost:5432/dt_intranet",
  },
})
