"use server"

import { getPortalSession } from "@/lib/portal/get-session"
import { createClaim } from "@/lib/intranet-client"
import { createNotification } from "@/lib/portal/notifications"

type ActionResult = {
  success: boolean
  error?: string
}

export async function submitClaim(formData: FormData): Promise<ActionResult> {
  const session = await getPortalSession()

  const product = formData.get("product") as string
  const orderNumber = formData.get("orderNumber") as string
  const desiredResolution = formData.get("desiredResolution") as string
  const description = formData.get("description") as string

  if (!product?.trim() || !desiredResolution || !description?.trim()) {
    return { success: false, error: "Vyplnte vsechna povinna pole." }
  }

  if (description.trim().length < 10) {
    return { success: false, error: "Popis musi mit alespon 10 znaku." }
  }

  try {
    await createClaim({
      companyId: session.companyId,
      companyName: "",
      contactName: `${session.firstName} ${session.lastName}`,
      email: session.email,
      product: product.trim(),
      invoiceNumber: orderNumber?.trim() || undefined,
      description: `[${desiredResolution}] ${description.trim()}`,
    })

    await createNotification({
      companyId: session.companyId,
      type: "claim",
      title: `Nova reklamace — ${product.trim()}`,
      message: `Pozadovane reseni: ${desiredResolution}`,
      relatedId: session.userId,
      relatedUrl: "/portal/reklamace",
    })

    return { success: true }
  } catch (e) {
    console.error("[Claim] Submit error:", e)
    return { success: false, error: "Nepodarilo se odeslat reklamaci. Zkuste to prosim znovu." }
  }
}
