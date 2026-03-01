import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { getPortalSession } from "@/lib/portal/get-session"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"

export async function GET() {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const leads = await db
    .select()
    .from(webLeads)
    .orderBy(desc(webLeads.createdAt))

  return NextResponse.json({ leads })
}
