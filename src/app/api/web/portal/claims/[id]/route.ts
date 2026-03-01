import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getClaimById } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const claim = await getClaimById(session.user.companyId, id)

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 })
  }

  return NextResponse.json(claim)
}
