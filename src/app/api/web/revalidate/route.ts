import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const token = req.headers.get("X-Revalidate-Token")
  if (token !== process.env.REVALIDATE_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { paths } = body as { paths?: string[] }

  if (!paths || !Array.isArray(paths)) {
    return Response.json({ error: "Missing paths array" }, { status: 400 })
  }

  for (const path of paths) {
    revalidatePath(path)
  }

  return Response.json({ revalidated: true, paths })
}
