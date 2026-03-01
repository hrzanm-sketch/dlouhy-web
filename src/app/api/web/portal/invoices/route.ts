import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getInvoices } from "@/lib/portal/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invoices = await getInvoices(session.user.companyId)
  return NextResponse.json({ invoices })
}
