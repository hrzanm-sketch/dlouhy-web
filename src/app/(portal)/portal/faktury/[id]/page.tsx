import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn, formatAmount, formatDate } from "@/lib/utils"

// TODO: replace with real query
const MOCK_INVOICES: Record<
  string,
  {
    id: string
    invoiceNumber: string
    date: string
    dueDate: string
    status: "unpaid" | "paid" | "overdue"
    amount: number
    items: { name: string; quantity: number; unitPrice: number; total: number }[]
    paymentInfo: {
      bankAccount: string
      variableSymbol: string
      iban: string
    }
  }
> = {
  "1": {
    id: "1",
    invoiceNumber: "FA-2026-0042",
    date: "2026-02-20",
    dueDate: "2026-03-20",
    status: "unpaid",
    amount: 1250000,
    items: [
      {
        name: "SAMSON Type 3241 DN50",
        quantity: 2,
        unitPrice: 450000,
        total: 900000,
      },
      {
        name: "Pozicioner 3730-2",
        quantity: 2,
        unitPrice: 125000,
        total: 250000,
      },
      {
        name: "Montazni sada",
        quantity: 1,
        unitPrice: 100000,
        total: 100000,
      },
    ],
    paymentInfo: {
      bankAccount: "123456789/0100",
      variableSymbol: "20260042",
      iban: "CZ65 0100 0000 0001 2345 6789",
    },
  },
  "2": {
    id: "2",
    invoiceNumber: "FA-2026-0038",
    date: "2026-02-05",
    dueDate: "2026-03-05",
    status: "paid",
    amount: 875000,
    items: [
      {
        name: "SAMSON Type 3241 DN25",
        quantity: 1,
        unitPrice: 875000,
        total: 875000,
      },
    ],
    paymentInfo: {
      bankAccount: "123456789/0100",
      variableSymbol: "20260038",
      iban: "CZ65 0100 0000 0001 2345 6789",
    },
  },
  "3": {
    id: "3",
    invoiceNumber: "FA-2026-0035",
    date: "2026-01-25",
    dueDate: "2026-02-25",
    status: "overdue",
    amount: 2340000,
    items: [
      {
        name: "SAMSON Type 3241 DN100",
        quantity: 3,
        unitPrice: 650000,
        total: 1950000,
      },
      {
        name: "Montazni sada DN100",
        quantity: 3,
        unitPrice: 130000,
        total: 390000,
      },
    ],
    paymentInfo: {
      bankAccount: "123456789/0100",
      variableSymbol: "20260035",
      iban: "CZ65 0100 0000 0001 2345 6789",
    },
  },
}

const STATUS_LABELS: Record<string, string> = {
  unpaid: "Neuhrazeno",
  paid: "Uhrazeno",
  overdue: "Po splatnosti",
}

const STATUS_COLORS: Record<string, string> = {
  unpaid: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const invoice = MOCK_INVOICES[id]
  return {
    title: invoice
      ? `Faktura ${invoice.invoiceNumber}`
      : "Faktura nenalezena",
  }
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = MOCK_INVOICES[id]

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/portal/faktury"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na faktury
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Vystaveno: {formatDate(invoice.date)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              STATUS_COLORS[invoice.status]
            )}
          >
            {STATUS_LABELS[invoice.status]}
          </span>
          <p className="text-xl font-bold text-neutral-900">
            {formatAmount(invoice.amount)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Payment info */}
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
                    : "text-neutral-900"
                )}
              >
                {formatDate(invoice.dueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Cislo uctu</dt>
              <dd className="font-medium text-neutral-900">
                {invoice.paymentInfo.bankAccount}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Variabilni symbol</dt>
              <dd className="font-medium text-neutral-900">
                {invoice.paymentInfo.variableSymbol}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">IBAN</dt>
              <dd className="font-mono text-xs text-neutral-900">
                {invoice.paymentInfo.iban}
              </dd>
            </div>
          </dl>

          {/* TODO: implement PDF download */}
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-dark"
          >
            Stahnout PDF
          </button>
        </div>

        {/* Items table */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Polozky
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-3 pr-4 font-medium">Produkt</th>
                  <th className="py-3 pr-4 font-medium">Pocet</th>
                  <th className="py-3 pr-4 text-right font-medium">
                    Jednotkova cena
                  </th>
                  <th className="py-3 text-right font-medium">Celkem</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-neutral-900">
                      {item.name}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {item.quantity}
                    </td>
                    <td className="py-3 pr-4 text-right text-neutral-600">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatAmount(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-neutral-200">
                  <td
                    colSpan={3}
                    className="py-3 pr-4 text-right font-semibold text-neutral-900"
                  >
                    Celkem
                  </td>
                  <td className="py-3 text-right font-bold text-neutral-900">
                    {formatAmount(invoice.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
