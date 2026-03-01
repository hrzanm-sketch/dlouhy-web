import { NextResponse } from "next/server"
import { claimUpdateWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"
import { sendEmail } from "@/lib/email/send"
import { ClaimUpdateNotification } from "@/lib/email/templates/claim-update-notification"
import { getPortalUsersForEmail } from "@/lib/portal/get-email-recipients"

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

  // Send email to all active portal users with email notifications enabled
  const recipients = await getPortalUsersForEmail(data.companyId, "claim_update")
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: `Reklamace ${data.claimNumber} — ${statusLabel}`,
      react: ClaimUpdateNotification({
        claimNumber: data.claimNumber,
        status: statusLabel,
        description: data.description,
      }),
    })
  }

  console.log(`[Webhook] Claim update: ${data.claimNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
