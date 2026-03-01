import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getOrders } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orders = await getOrders(session.user.companyId)
  return NextResponse.json({ orders })
}
