import { NextResponse } from "next/server"
import { serviceRequestSchema } from "@/lib/validations/service-request"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email/send"
import { ServiceConfirmation } from "@/lib/email/templates/service-confirmation"
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
  const parsed = serviceRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatna data" }, { status: 400 })
  }

  try {
    await db.insert(webLeads).values({
      type: "service",
      status: "new",
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
      subject: `Servisni poptavka — ${parsed.data.urgency}`,
      message: parsed.data.message,
      urgency: parsed.data.urgency,
      preferredDate: parsed.data.preferredDate || null,
      location: parsed.data.location || null,
      gdprConsent: true,
      sourceUrl: "/api/web/service-inquiry",
      ipAddress: ip,
    })

    const templateUrgency = parsed.data.urgency === "urgent" ? "high" : parsed.data.urgency as "normal" | "critical"

    await sendEmail({
      to: parsed.data.contactEmail,
      subject: "Potvrzení servisního požadavku — Dlouhy Technology",
      react: ServiceConfirmation({
        contactName: parsed.data.contactName,
        urgency: templateUrgency,
        preferredDate: parsed.data.preferredDate,
        location: parsed.data.location,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Failed to save service request:", e)
    return NextResponse.json(
      { error: "Nepodarilo se odeslat poptavku." },
      { status: 500 }
    )
  }
}
