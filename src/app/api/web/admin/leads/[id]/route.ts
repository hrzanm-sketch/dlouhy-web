import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getPortalSession } from "@/lib/portal/get-session"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"

const VALID_STATUSES = ["new", "contacted", "qualified", "resolved", "rejected"]

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

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const [updated] = await db
    .update(webLeads)
    .set({ status, updatedAt: new Date() })
    .where(eq(webLeads.id, id))
    .returning({ id: webLeads.id, status: webLeads.status })

  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, id: updated.id, status: updated.status })
}
