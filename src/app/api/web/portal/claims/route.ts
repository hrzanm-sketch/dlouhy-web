import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { getClaims } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getPortalSession()

  const claims = await getClaims(session.companyId)
  return NextResponse.json({ claims })
}

export async function POST() {
  await getPortalSession()

  return NextResponse.json(
    { error: "Claim creation not implemented yet" },
    { status: 501 }
  )
}
