"use server"

import { claimSchema } from "@/lib/validations/claim"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"

export async function submitClaim(data: unknown) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  const { success } = rateLimit(ip)
  if (!success) {
    return {
      success: false,
      error: "Prilis mnoho pozadavku. Zkuste to za chvili.",
    }
  }

  const parsed = claimSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Neplatna data" }
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
      sourceUrl: "/reklamace",
      ipAddress: ip,
    })

    return { success: true }
  } catch (e) {
    console.error("Failed to save claim:", e)
    return {
      success: false,
      error: "Nepodarilo se odeslat reklamaci. Zkuste to pozdeji.",
    }
  }
}
