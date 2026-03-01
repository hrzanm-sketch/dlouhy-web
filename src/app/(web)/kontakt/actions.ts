"use server"

import { contactSchema } from "@/lib/validations/contact"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function submitContact(data: unknown) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  const { success } = rateLimit(ip)
  if (!success) {
    return {
      success: false,
      error: "Prilis mnoho pozadavku. Zkuste to za chvili.",
    }
  }

  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Neplatna data" }
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
      sourceUrl: "/kontakt",
      ipAddress: ip,
    })

    return { success: true }
  } catch (e) {
    console.error("Failed to save contact:", e)
    return {
      success: false,
      error: "Nepodarilo se odeslat zpravu. Zkuste to pozdeji.",
    }
  }
}
