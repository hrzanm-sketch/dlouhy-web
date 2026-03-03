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
import { Homepage } from "@/payload/globals/Homepage"
import { SiteSettings } from "@/payload/globals/SiteSettings"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const payloadSecret = process.env.PAYLOAD_SECRET
if (!payloadSecret) throw new Error("PAYLOAD_SECRET environment variable is required")

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL environment variable is required")

export default buildConfig({
  secret: payloadSecret,
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
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
  globals: [Homepage, SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
})
