import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await params

  // TODO: Implement PDF generation/download from intranet
  return NextResponse.json(
    { error: "PDF download not implemented yet" },
    { status: 501 },
  )
}
