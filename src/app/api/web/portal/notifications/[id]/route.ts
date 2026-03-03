import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { markAsRead } from "@/lib/portal/notifications"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getPortalSession()
  const { id } = await params

  const success = await markAsRead(id, session.userId)
  if (!success) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
