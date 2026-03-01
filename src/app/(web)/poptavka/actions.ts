"use server"

import { inquirySchema } from "@/lib/validations/inquiry"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function submitInquiry(data: unknown) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  const { success } = rateLimit(ip)
  if (!success) {
    return {
      success: false,
      error: "Prilis mnoho pozadavku. Zkuste to za chvili.",
    }
  }

  const parsed = inquirySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Neplatna data" }
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
      sourceUrl: "/poptavka",
      ipAddress: ip,
    })

    return { success: true }
  } catch (e) {
    console.error("Failed to save inquiry:", e)
    return {
      success: false,
      error: "Nepodarilo se odeslat poptavku. Zkuste to pozdeji.",
    }
  }
}
