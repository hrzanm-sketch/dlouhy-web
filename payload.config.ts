import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { fileURLToPath } from "url"
import { Products } from "@/payload/collections/Products"
import { Categories } from "@/payload/collections/Categories"
import { Downloads } from "@/payload/collections/Downloads"
import { References } from "@/payload/collections/References"
import { Articles } from "@/payload/collections/Articles"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        "postgresql://dt:dt_local_dev@localhost:5432/dt_intranet",
    },
  }),
  editor: lexicalEditor(),
  collections: [
    {
      slug: "media",
      upload: {
        staticDir: path.resolve(dirname, "public/media"),
        mimeTypes: ["image/*", "application/pdf"],
      },
      fields: [{ name: "alt", type: "text" }],
    },
    Products,
    Categories,
    Downloads,
    References,
    Articles,
  ],
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
})
