import Link from "next/link"
import { cn, formatAmount, formatDate } from "@/lib/utils"

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  status: string
  amount: number
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Koncept",
  sent: "Neuhrazeno",
  overdue: "Po splatnosti",
  paid: "Uhrazeno",
  cancelled: "Storno",
  unpaid: "Neuhrazeno",
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-800",
  sent: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-600",
  unpaid: "bg-yellow-100 text-yellow-800",
}

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        Žádné faktury k zobrazení.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="py-3 pr-4 font-medium">Číslo faktury</th>
            <th className="py-3 pr-4 font-medium">Datum vystavení</th>
            <th className="py-3 pr-4 font-medium">Splatnost</th>
            <th className="py-3 pr-4 font-medium">Stav</th>
            <th className="py-3 pr-4 text-right font-medium">Částka</th>
            <th className="py-3 text-right font-medium">Akce</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
            >
              <td className="py-3 pr-4">
                <Link
                  href={`/portal/faktury/${invoice.id}`}
                  className="font-medium text-dt-blue hover:underline"
                >
                  {invoice.invoiceNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-neutral-600">
                {formatDate(invoice.date)}
              </td>
              <td className="py-3 pr-4 text-neutral-600">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STATUS_COLORS[invoice.status]
                  )}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="py-3 pr-4 text-right font-medium">
                {formatAmount(invoice.amount)}
              </td>
              <td className="py-3 text-right">
                {/* TODO: implement PDF download */}
                <button
                  type="button"
                  className="text-sm text-dt-blue hover:underline"
                >
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
