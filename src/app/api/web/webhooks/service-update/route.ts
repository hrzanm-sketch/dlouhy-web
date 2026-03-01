import { NextResponse } from "next/server"
import { serviceUpdateWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"
import { sendEmail } from "@/lib/email/send"
import { ServiceUpdateNotification } from "@/lib/email/templates/service-update-notification"
import { getPortalUsersForEmail } from "@/lib/portal/get-email-recipients"

const STATUS_LABELS: Record<string, string> = {
  new: "Novy",
  in_progress: "V realizaci",
  waiting_parts: "Ceka na dily",
  completed: "Dokonceno",
  cancelled: "Zruseno",
}

export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key")
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const result = serviceUpdateWebhookSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: "Invalid payload", details: result.error.flatten() }, { status: 400 })
  }

  const data = result.data
  const statusLabel = STATUS_LABELS[data.status] || data.status

  await createNotification({
    companyId: data.companyId,
    type: "service_update",
    title: `Servis ${data.requestNumber} — ${statusLabel}`,
    message: data.description || `Stav servisniho pozadavku zmenen na: ${statusLabel}`,
    relatedId: data.serviceRequestId,
    relatedUrl: `/portal/servis/${data.serviceRequestId}`,
  })

  // Send email to all active portal users with email notifications enabled
  const recipients = await getPortalUsersForEmail(data.companyId, "service_update")
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: `Servis ${data.requestNumber} — ${statusLabel}`,
      react: ServiceUpdateNotification({
        requestNumber: data.requestNumber,
        status: statusLabel,
        description: data.description,
      }),
    })
  }

  console.log(`[Webhook] Service update: ${data.requestNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
