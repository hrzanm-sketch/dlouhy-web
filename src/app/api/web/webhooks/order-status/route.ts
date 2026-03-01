import { NextResponse } from "next/server"
import { orderStatusWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"
import { sendEmail } from "@/lib/email/send"
import { OrderStatusNotification } from "@/lib/email/templates/order-status-notification"
import { getPortalUsersForEmail } from "@/lib/portal/get-email-recipients"

const STATUS_LABELS: Record<string, string> = {
  pending: "Cekajici",
  confirmed: "Potvrzeno",
  shipped: "Odeslano",
  completed: "Dokonceno",
}

export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key")
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const result = orderStatusWebhookSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: "Invalid payload", details: result.error.flatten() }, { status: 400 })
  }

  const data = result.data
  const statusLabel = STATUS_LABELS[data.status] || data.status

  await createNotification({
    companyId: data.companyId,
    type: "order_status",
    title: `Objednavka ${data.orderNumber} — ${statusLabel}`,
    message: data.description || `Stav objednavky zmenen na: ${statusLabel}`,
    relatedId: data.orderId,
    relatedUrl: `/portal/objednavky/${data.orderId}`,
  })

  // Send email to all active portal users with email notifications enabled
  const recipients = await getPortalUsersForEmail(data.companyId, "order_status")
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: `Objednavka ${data.orderNumber} — ${statusLabel}`,
      react: OrderStatusNotification({
        orderNumber: data.orderNumber,
        status: statusLabel,
        description: data.description,
      }),
    })
  }

  console.log(`[Webhook] Order status: ${data.orderNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
