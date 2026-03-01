"use server"

import { serviceRequestSchema } from "@/lib/validations/service-request"
import { db } from "@/lib/db"
import { webLeads } from "@/lib/db/schema"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"
import { sendEmail } from "@/lib/email/send"
import { ServiceConfirmation } from "@/lib/email/templates/service-confirmation"

export async function submitServiceRequest(data: unknown) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"

  const { success } = rateLimit(ip)
  if (!success) {
    return {
      success: false,
      error: "Prilis mnoho pozadavku. Zkuste to za chvili.",
    }
  }

  const parsed = serviceRequestSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Neplatna data" }
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
      sourceUrl: "/servis/poptavka",
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

    return { success: true }
  } catch (e) {
    console.error("Failed to save service request:", e)
    return {
      success: false,
      error: "Nepodarilo se odeslat poptavku. Zkuste to pozdeji.",
    }
  }
}
