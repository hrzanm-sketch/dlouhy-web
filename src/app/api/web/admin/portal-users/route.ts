import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email/send"
import { PortalInvite } from "@/lib/email/templates/portal-invite"

export async function GET() {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await db.select().from(portalUsers)

  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { firstName, lastName, email, companyId, companyName } = body

  if (!firstName || !lastName || !email || !companyId) {
    return NextResponse.json(
      { error: "Missing required fields: firstName, lastName, email, companyId" },
      { status: 400 },
    )
  }

  const inviteToken = crypto.randomUUID()
  const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const [user] = await db
    .insert(portalUsers)
    .values({
      firstName,
      lastName,
      email,
      companyId,
      inviteToken,
      inviteExpiresAt,
      invitedBy: session.userId,
      isActive: false,
    })
    .returning()

  const baseUrl = process.env.AUTH_URL || "https://dlouhy-technology.cz"
  const inviteUrl = `${baseUrl}/portal/prvni-prihlaseni/${inviteToken}`

  await sendEmail({
    to: email,
    subject: "Pozvánka do zákaznického portálu Dlouhý Technology",
    react: PortalInvite({
      firstName,
      companyName: companyName || "Vaše společnost",
      inviteUrl,
    }),
  })

  return NextResponse.json(
    { success: true, user: { id: user.id, email: user.email } },
    { status: 201 },
  )
}
