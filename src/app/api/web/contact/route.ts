import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations/contact"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email/send"
import { ContactConfirmation } from "@/lib/email/templates/contact-confirmation"
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
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatna data" }, { status: 400 })
  }

  try {
    await db.insert(webLeads).values({
      type: "contact",
      status: "new",
      companyName: "-",
      contactName: parsed.data.name,
      contactEmail: parsed.data.email,
      contactPhone: parsed.data.phone || null,
      subject: "Kontaktni formular",
      message: parsed.data.message,
      gdprConsent: true,
      sourceUrl: "/api/web/contact",
      ipAddress: ip,
    })

    await sendEmail({
      to: parsed.data.email,
      subject: "Potvrzení zprávy — Dlouhý Technology",
      react: ContactConfirmation({
        name: parsed.data.name,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Failed to save contact:", e)
    return NextResponse.json(
      { error: "Nepodarilo se odeslat zpravu." },
      { status: 500 }
    )
  }
}
