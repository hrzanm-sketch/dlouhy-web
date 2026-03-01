import { NextResponse } from "next/server"
import { orderStatusWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"

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

  // TODO: Look up customer email from companyId
  // await sendEmail({
  //   to: customerEmail,
  //   subject: `Objednavka ${data.orderNumber} — ${statusLabel}`,
  //   react: OrderStatusNotification({ orderNumber: data.orderNumber, status: statusLabel, description: data.description }),
  // })

  console.log(`[Webhook] Order status: ${data.orderNumber} → ${data.status}`)

  return NextResponse.json({ success: true })
}
