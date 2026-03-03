import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { getServiceRequests } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getPortalSession()

  const serviceRequests = await getServiceRequests(session.companyId)
  return NextResponse.json({ serviceRequests })
}

export async function POST() {
  await getPortalSession()

  return NextResponse.json(
    { error: "Service request creation not implemented yet" },
    { status: 501 }
  )
}
