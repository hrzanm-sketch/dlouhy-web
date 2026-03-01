"use server"

import { getPortalSession } from "@/lib/portal/get-session"
import { createServiceRequest } from "@/lib/intranet-client"
import { createNotification } from "@/lib/portal/notifications"

type ActionResult = {
  success: boolean
  error?: string
}

export async function submitServiceRequest(formData: FormData): Promise<ActionResult> {
  const session = await getPortalSession()

  const type = formData.get("type") as string
  const urgency = formData.get("urgency") as string
  const product = formData.get("product") as string
  const location = formData.get("location") as string
  const preferredDate = formData.get("preferredDate") as string
  const description = formData.get("description") as string

  if (!type || !urgency || !product?.trim() || !description?.trim()) {
    return { success: false, error: "Vyplnte vsechna povinna pole." }
  }

  if (description.trim().length < 10) {
    return { success: false, error: "Popis musi mit alespon 10 znaku." }
  }

  try {
    await createServiceRequest({
      companyId: session.companyId,
      contactName: `${session.firstName} ${session.lastName}`,
      email: session.email,
      product: product.trim(),
      description: `[${type}/${urgency}] ${description.trim()}${location ? ` | Lokace: ${location}` : ""}${preferredDate ? ` | Preferovany termin: ${preferredDate}` : ""}`,
    })

    await createNotification({
      companyId: session.companyId,
      type: "service_request",
      title: `Novy servisni pozadavek — ${product.trim()}`,
      message: `Typ: ${type}, nalehavost: ${urgency}`,
      relatedId: session.userId,
      relatedUrl: "/portal/servis",
    })

    return { success: true }
  } catch (e) {
    console.error("[ServiceRequest] Submit error:", e)
    return { success: false, error: "Nepodarilo se odeslat pozadavek. Zkuste to prosim znovu." }
  }
}
