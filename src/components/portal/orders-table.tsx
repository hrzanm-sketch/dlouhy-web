import Link from "next/link"
import { cn, formatAmount, formatDate } from "@/lib/utils"

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "completed"
  amount: number
  itemCount: number
}

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Cekajici",
  confirmed: "Potvrzeno",
  shipped: "Odeslano",
  completed: "Dokonceno",
}

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        Zadne objednavky k zobrazeni.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="py-3 pr-4 font-medium">Cislo objednavky</th>
            <th className="py-3 pr-4 font-medium">Datum</th>
            <th className="py-3 pr-4 font-medium">Polozek</th>
            <th className="py-3 pr-4 font-medium">Stav</th>
            <th className="py-3 text-right font-medium">Castka</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
            >
              <td className="py-3 pr-4">
                <Link
                  href={`/portal/objednavky/${order.id}`}
                  className="font-medium text-dt-blue hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-neutral-600">
                {formatDate(order.date)}
              </td>
              <td className="py-3 pr-4 text-neutral-600">{order.itemCount}</td>
              <td className="py-3 pr-4">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STATUS_COLORS[order.status]
                  )}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </td>
              <td className="py-3 text-right font-medium">
                {formatAmount(order.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
