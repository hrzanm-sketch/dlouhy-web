import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"

// TODO: replace with real DB queries
const MOCK_PORTAL_USERS = [
  {
    id: "1",
    firstName: "Jan",
    lastName: "Novak",
    email: "jan.novak@acme.cz",
    companyName: "ACME s.r.o.",
    role: "user",
    isActive: true,
    lastLogin: "2026-02-28T08:00:00Z",
  },
  {
    id: "2",
    firstName: "Eva",
    lastName: "Horakova",
    email: "eva@betafirm.cz",
    companyName: "Beta Firm a.s.",
    role: "user",
    isActive: true,
    lastLogin: "2026-02-25T14:00:00Z",
  },
  {
    id: "3",
    firstName: "Martin",
    lastName: "Dvorak",
    email: "martin@gammacorp.cz",
    companyName: "Gamma Corp s.r.o.",
    role: "user",
    isActive: false,
    lastLogin: null,
  },
]

export async function GET() {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ users: MOCK_PORTAL_USERS })
}

export async function POST(req: Request) {
  const session = await getPortalSession()

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { firstName, lastName, email, companyId } = body

  if (!firstName || !lastName || !email || !companyId) {
    return NextResponse.json(
      { error: "Missing required fields: firstName, lastName, email, companyId" },
      { status: 400 },
    )
  }

  // TODO: Create portal user in DB + send invite email
  // const user = await db.insert(portalUsers).values({...}).returning()
  // await sendEmail({ to: email, subject: "Pozvanka do portalu", react: <PortalInvite ... /> })

  console.log(`[Admin] New portal user created: ${email} by ${session.userId}`)

  return NextResponse.json(
    { success: true, message: "User created and invite sent" },
    { status: 201 },
  )
}
