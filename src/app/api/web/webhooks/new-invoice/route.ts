import { NextResponse } from "next/server"
import { newInvoiceWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"

export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key")
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const result = newInvoiceWebhookSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: "Invalid payload", details: result.error.flatten() }, { status: 400 })
  }

  const data = result.data
  const amountFormatted = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  }).format(data.amount / 100)

  await createNotification({
    companyId: data.companyId,
    type: "new_invoice",
    title: `Nova faktura ${data.invoiceNumber}`,
    message: `Castka: ${amountFormatted}, splatnost: ${data.dueDate}`,
    relatedId: data.invoiceId,
    relatedUrl: `/portal/faktury/${data.invoiceId}`,
  })

  // TODO: Look up customer email and send notification
  console.log(`[Webhook] New invoice: ${data.invoiceNumber}`)

  return NextResponse.json({ success: true })
}
