import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn, formatAmount, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getInvoiceById } from "@/lib/portal/queries"

const STATUS_LABELS: Record<string, string> = {
  draft: "Koncept",
  sent: "Neuhrazeno",
  overdue: "Po splatnosti",
  paid: "Uhrazeno",
  cancelled: "Storno",
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-800",
  sent: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-600",
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Detail faktury",
  }
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getPortalSession()
  const { id } = await params
  const invoice = await getInvoiceById(session.companyId, id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link
        href="/portal/faktury"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na faktury
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {invoice.title}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Vystaveno: {formatDate(invoice.date)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              STATUS_COLORS[invoice.status] || "bg-neutral-100 text-neutral-800",
            )}
          >
            {STATUS_LABELS[invoice.status] || invoice.status}
          </span>
          <p className="text-xl font-bold text-neutral-900">
            {formatAmount(invoice.amount)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Platebni udaje
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Splatnost</dt>
              <dd
                className={cn(
                  "font-medium",
                  invoice.status === "overdue"
                    ? "text-red-600"
                    : "text-neutral-900",
                )}
              >
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            {invoice.paidAt && (
              <div>
                <dt className="text-neutral-500">Uhrazeno</dt>
                <dd className="font-medium text-green-700">
                  {formatDate(invoice.paidAt)}
                </dd>
              </div>
            )}
            {invoice.note && (
              <div>
                <dt className="text-neutral-500">Poznamka</dt>
                <dd className="text-neutral-700">{invoice.note}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Informace o fakture
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Cislo faktury</dt>
              <dd className="font-medium text-neutral-900">{invoice.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Castka</dt>
              <dd className="font-medium text-neutral-900">{formatAmount(invoice.amount)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Datum vystaveni</dt>
              <dd className="font-medium text-neutral-900">{formatDate(invoice.date)}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Datum splatnosti</dt>
              <dd className="font-medium text-neutral-900">{formatDate(invoice.dueDate)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
