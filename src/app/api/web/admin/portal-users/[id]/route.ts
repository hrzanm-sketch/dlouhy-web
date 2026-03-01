import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getPortalSession } from "@/lib/portal/get-session"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"

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

  const [updated] = await db
    .update(portalUsers)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(portalUsers.id, id))
    .returning({ id: portalUsers.id, isActive: portalUsers.isActive })

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, id: updated.id, isActive: updated.isActive })
}
