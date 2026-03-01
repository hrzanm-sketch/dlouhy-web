import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDocuments } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const documents = await getDocuments(session.user.companyId)
  return NextResponse.json({ documents })
}
