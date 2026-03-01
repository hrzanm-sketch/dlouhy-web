import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderTimeline } from "@/components/portal/order-timeline"
import { cn, formatAmount, formatDate } from "@/lib/utils"

// TODO: replace with real query
const MOCK_ORDERS: Record<
  string,
  {
    id: string
    orderNumber: string
    date: string
    status: "pending" | "confirmed" | "shipped" | "completed"
    amount: number
    items: { name: string; quantity: number; unitPrice: number; total: number }[]
    timeline: { date: string; status: string; description: string }[]
  }
> = {
  "1": {
    id: "1",
    orderNumber: "OBJ-2026-0042",
    date: "2026-02-15",
    status: "shipped",
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
    timeline: [
      {
        date: "2026-02-15",
        status: "Prijato",
        description: "Objednavka prijata",
      },
      {
        date: "2026-02-16",
        status: "Potvrzeno",
        description: "Objednavka potvrzena, termin dodani 5.3.2026",
      },
      {
        date: "2026-02-28",
        status: "Odeslano",
        description: "Zasilka odeslana prepravcem PPL",
      },
    ],
  },
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Cekajici",
  confirmed: "Potvrzeno",
  shipped: "Odeslano",
  completed: "Dokonceno",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const order = MOCK_ORDERS[id]
  return {
    title: order ? `Objednavka ${order.orderNumber}` : "Objednavka nenalezena",
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = MOCK_ORDERS[id]

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/portal/objednavky"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na objednavky
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {formatDate(order.date)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              STATUS_COLORS[order.status]
            )}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <p className="text-xl font-bold text-neutral-900">
            {formatAmount(order.amount)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Timeline */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Stav objednavky
          </h2>
          <OrderTimeline steps={order.timeline} />
        </div>

        {/* Items + Documents */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items table */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
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
                  {order.items.map((item, idx) => (
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
                      {formatAmount(order.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Dokumenty
            </h2>
            <div className="space-y-2">
              {/* TODO: link to real documents */}
              <button
                type="button"
                className="block text-sm text-dt-blue hover:underline"
              >
                Dodaci list
              </button>
              <button
                type="button"
                className="block text-sm text-dt-blue hover:underline"
              >
                Faktura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
