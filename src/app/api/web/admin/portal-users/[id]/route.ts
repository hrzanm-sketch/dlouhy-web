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
  const { isActive } = body

  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be boolean" }, { status: 400 })
  }

  // TODO: update portal user in DB
  console.log(`[Admin] Portal user ${id} ${isActive ? "activated" : "deactivated"} by ${session.userId}`)

  return NextResponse.json({ success: true, id, isActive })
}
