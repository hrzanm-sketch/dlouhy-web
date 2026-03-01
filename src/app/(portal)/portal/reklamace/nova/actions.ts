"use server"

import { getPortalSession } from "@/lib/portal/get-session"

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

  // TODO: Call intranet API to create claim
  // const result = await createClaim({
  //   companyId: session.companyId,
  //   product, orderNumber, desiredResolution, description,
  //   createdBy: session.userId,
  // })

  console.log("[Claim] New claim from", session.companyId, {
    product,
    orderNumber,
    desiredResolution,
    description: description.substring(0, 100),
  })

  return { success: true }
}
