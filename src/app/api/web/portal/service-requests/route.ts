import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getServiceRequests } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const serviceRequests = await getServiceRequests(session.user.companyId)
  return NextResponse.json({ serviceRequests })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  // TODO: Validate with Zod, call intranet API to create service request
  const newRequest = {
    id: crypto.randomUUID(),
    requestNumber: `SRV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split("T")[0],
    status: "new" as const,
    subject: body.subject || "",
    description: body.description || "",
  }

  return NextResponse.json(newRequest, { status: 201 })
}
