import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getServiceRequestById } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const serviceRequest = await getServiceRequestById(
    session.user.companyId,
    id,
  )

  if (!serviceRequest) {
    return NextResponse.json(
      { error: "Service request not found" },
      { status: 404 },
    )
  }

  return NextResponse.json(serviceRequest)
}
