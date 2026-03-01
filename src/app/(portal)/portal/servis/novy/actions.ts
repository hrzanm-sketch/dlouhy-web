"use server"

import { getPortalSession } from "@/lib/portal/get-session"

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

  // TODO: Call intranet API to create service request
  // const result = await createServiceRequest({
  //   companyId: session.companyId,
  //   type, urgency, product, location, preferredDate, description,
  //   createdBy: session.userId,
  // })

  console.log("[ServiceRequest] New request from", session.companyId, {
    type,
    urgency,
    product,
    location,
    preferredDate,
    description: description.substring(0, 100),
  })

  return { success: true }
}
