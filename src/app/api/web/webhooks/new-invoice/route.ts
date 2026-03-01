import { NextResponse } from "next/server"
import { newInvoiceWebhookSchema } from "@/lib/validations/webhooks"
import { createNotification } from "@/lib/portal/notifications"
import { sendEmail } from "@/lib/email/send"
import { InvoiceNotification } from "@/lib/email/templates/invoice-notification"
import { getPortalUsersForEmail } from "@/lib/portal/get-email-recipients"

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

  // Send email to all active portal users with email notifications enabled
  const recipients = await getPortalUsersForEmail(data.companyId, "new_invoice")
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: `Nova faktura ${data.invoiceNumber} — ${amountFormatted}`,
      react: InvoiceNotification({
        invoiceNumber: data.invoiceNumber,
        amount: amountFormatted,
        dueDate: data.dueDate,
      }),
    })
  }

  console.log(`[Webhook] New invoice: ${data.invoiceNumber}`)

  return NextResponse.json({ success: true })
}
