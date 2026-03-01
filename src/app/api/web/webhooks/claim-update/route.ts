import { NextResponse } from "next/server"
import { claimUpdateWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"

const STATUS_LABELS: Record<string, string> = {
  new: "Nova",
  investigating: "V setreni",
  approved: "Schvaleno",
  rejected: "Zamitnuto",
  resolved: "Vyreseno",
}

export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key")
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const result = claimUpdateWebhookSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: "Invalid payload", details: result.error.flatten() }, { status: 400 })
  }

  const data = result.data
  const statusLabel = STATUS_LABELS[data.status] || data.status

  await createNotification({
    companyId: data.companyId,
    type: "claim_update",
    title: `Reklamace ${data.claimNumber} — ${statusLabel}`,
    message: data.description || `Stav reklamace zmenen na: ${statusLabel}`,
    relatedId: data.claimId,
    relatedUrl: `/portal/reklamace/${data.claimId}`,
  })

  console.log(`[Webhook] Claim update: ${data.claimNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
