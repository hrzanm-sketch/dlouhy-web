import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { status } = body

  if (!status || !["new", "contacted", "qualified", "resolved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  // TODO: update lead in DB
  console.log(`[Admin] Lead ${id} status updated to ${status} by ${session.userId}`)

  return NextResponse.json({ success: true, id, status })
}
