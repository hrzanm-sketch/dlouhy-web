import { NextResponse } from "next/server"
import { serviceUpdateWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"

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

  console.log(`[Webhook] Service update: ${data.requestNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
