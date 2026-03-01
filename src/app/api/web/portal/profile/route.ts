import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [user] = await db
    .select({
      id: portalUsers.id,
      email: portalUsers.email,
      firstName: portalUsers.firstName,
      lastName: portalUsers.lastName,
      phone: portalUsers.phone,
      jobTitle: portalUsers.jobTitle,
      role: portalUsers.role,
      emailNotifications: portalUsers.emailNotifications,
    })
    .from(portalUsers)
    .where(eq(portalUsers.id, session.user.id))
    .limit(1)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "jobTitle",
    "emailNotifications",
  ] as const

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    )
  }

  updates.updatedAt = new Date()

  await db
    .update(portalUsers)
    .set(updates)
    .where(eq(portalUsers.id, session.user.id))

  const [updated] = await db
    .select({
      id: portalUsers.id,
      email: portalUsers.email,
      firstName: portalUsers.firstName,
      lastName: portalUsers.lastName,
      phone: portalUsers.phone,
      jobTitle: portalUsers.jobTitle,
      role: portalUsers.role,
      emailNotifications: portalUsers.emailNotifications,
    })
    .from(portalUsers)
    .where(eq(portalUsers.id, session.user.id))
    .limit(1)

  return NextResponse.json(updated)
}
