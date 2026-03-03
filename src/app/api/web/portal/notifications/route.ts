import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { getNotifications, getUnreadCount } from "@/lib/portal/notifications"

export async function GET() {
  const session = await getPortalSession()

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(session.companyId, session.userId),
    getUnreadCount(session.companyId, session.userId),
  ])

  return NextResponse.json({ notifications, unreadCount })
}
