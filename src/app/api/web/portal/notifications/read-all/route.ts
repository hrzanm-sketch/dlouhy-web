import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { markAllRead } from "@/lib/portal/notifications"

export async function POST() {
  const session = await getPortalSession()
  const count = await markAllRead(session.companyId)
  return NextResponse.json({ success: true, markedCount: count })
}
