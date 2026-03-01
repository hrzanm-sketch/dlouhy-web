import { NextResponse } from "next/server"
import { claimSchema } from "@/lib/validations/claim"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email/send"
import { ClaimConfirmation } from "@/lib/email/templates/claim-confirmation"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  const { success } = rateLimit(ip)
  if (!success) {
    return NextResponse.json(
      { error: "Prilis mnoho pozadavku. Zkuste to za chvili." },
      { status: 429 }
    )
  }

  const body = await request.json()
  const parsed = claimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatna data" }, { status: 400 })
  }

  try {
    await db.insert(webLeads).values({
      type: "claim",
      status: "new",
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
      subject: "Reklamace",
      message: parsed.data.message,
      desiredResolution: parsed.data.desiredResolution,
      gdprConsent: true,
      sourceUrl: "/api/web/claim",
      ipAddress: ip,
    })

    await sendEmail({
      to: parsed.data.contactEmail,
      subject: "Potvrzení reklamace — Dlouhý Technology",
      react: ClaimConfirmation({
        contactName: parsed.data.contactName,
        desiredResolution: parsed.data.desiredResolution,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Failed to save claim:", e)
    return NextResponse.json(
      { error: "Nepodarilo se odeslat reklamaci." },
      { status: 500 }
    )
  }
}
