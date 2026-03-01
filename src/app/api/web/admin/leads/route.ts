import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/get-session"

// TODO: replace with real DB queries
const MOCK_LEADS = [
  {
    id: "1",
    type: "inquiry",
    companyName: "ABC s.r.o.",
    contactName: "Petr Svoboda",
    contactEmail: "petr@abc.cz",
    subject: "Poptavka regulacnich ventilu SAMSON",
    status: "new",
    createdAt: "2026-02-28T10:00:00Z",
  },
  {
    id: "2",
    type: "service",
    companyName: "XYZ a.s.",
    contactName: "Marie Kralova",
    contactEmail: "marie@xyz.cz",
    subject: "Servis SCHROEDAHL ventilu",
    status: "contacted",
    createdAt: "2026-02-25T14:30:00Z",
  },
  {
    id: "3",
    type: "claim",
    companyName: "DEF s.r.o.",
    contactName: "Tomas Maly",
    contactEmail: "tomas@def.cz",
    subject: "Reklamace pozicioneru",
    status: "resolved",
    createdAt: "2026-02-20T09:15:00Z",
  },
]

export async function GET() {
  const session = await getPortalSession()

  // TODO: check admin role
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ leads: MOCK_LEADS })
}
