import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getClaims } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const claims = await getClaims(session.user.companyId)
  return NextResponse.json({ claims })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  // TODO: Validate with Zod, call intranet API to create claim
  const newClaim = {
    id: crypto.randomUUID(),
    claimNumber: `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split("T")[0],
    status: "new" as const,
    subject: body.subject || "",
    description: body.description || "",
  }

  return NextResponse.json(newClaim, { status: 201 })
}
