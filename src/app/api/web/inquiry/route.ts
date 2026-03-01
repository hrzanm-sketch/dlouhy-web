import { NextResponse } from "next/server"
import { inquirySchema } from "@/lib/validations/inquiry"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { sendEmail } from "@/lib/email/send"
import { InquiryConfirmation } from "@/lib/email/templates/inquiry-confirmation"
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
  const parsed = inquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatna data" }, { status: 400 })
  }

  try {
    await db.insert(webLeads).values({
      type: "inquiry",
      status: "new",
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
      ico: parsed.data.ico || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
      productId: parsed.data.productId || null,
      gdprConsent: true,
      newsletterConsent: parsed.data.newsletterConsent || false,
      sourceUrl: "/api/web/inquiry",
      ipAddress: ip,
    })

    await sendEmail({
      to: parsed.data.contactEmail,
      subject: "Potvrzení poptávky — Dlouhý Technology",
      react: InquiryConfirmation({
        contactName: parsed.data.contactName,
        subject: parsed.data.subject,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Failed to save inquiry:", e)
    return NextResponse.json(
      { error: "Nepodarilo se odeslat poptavku." },
      { status: 500 }
    )
  }
}
