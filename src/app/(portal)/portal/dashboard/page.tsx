import type { Metadata } from "next"
import Link from "next/link"
import { KPICards } from "@/components/portal/kpi-cards"
import { formatAmount, formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard",
}

// TODO: replace with real queries from intranet DB
const MOCK_KPI = [
  {
    title: "Objednavky",
    count: 5,
    subtitle: "2 aktivni",
    href: "/portal/objednavky",
  },
  {
    title: "Faktury",
    count: 3,
    subtitle: "1 po splatnosti",
    subtitleWarning: true,
    href: "/portal/faktury",
  },
  {
    title: "Servis",
    count: 2,
    subtitle: "1 otevreny",
    href: "/portal/servis",
  },
  {
    title: "Reklamace",
    count: 1,
    href: "/portal/reklamace",
  },
]

// TODO: replace with real queries
const MOCK_RECENT_ORDERS = [
  {
    id: "1",
    orderNumber: "OBJ-2026-0042",
    date: "2026-02-15",
    status: "shipped" as const,
    amount: 1250000,
  },
  {
    id: "2",
    orderNumber: "OBJ-2026-0038",
    date: "2026-02-01",
    status: "completed" as const,
    amount: 875000,
  },
  {
    id: "3",
    orderNumber: "OBJ-2026-0035",
    date: "2026-01-20",
    status: "completed" as const,
    amount: 2340000,
  },
]

// TODO: replace with real queries
const MOCK_UNPAID_INVOICES = [
  {
    id: "1",
    invoiceNumber: "FA-2026-0042",
    dueDate: "2026-03-20",
    status: "unpaid" as const,
    amount: 1250000,
  },
  {
    id: "3",
    invoiceNumber: "FA-2026-0035",
    dueDate: "2026-02-25",
    status: "overdue" as const,
    amount: 2340000,
  },
]

const STATUS_LABELS: Record<string, string> = {
  pending: "Cekajici",
  confirmed: "Potvrzeno",
  shipped: "Odeslano",
  completed: "Dokonceno",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      {/* KPI Cards */}
      <KPICards cards={MOCK_KPI} />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/portal/servis/novy"
          className="rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-dark"
        >
          Novy servisni pozadavek
        </Link>
        <Link
          href="/portal/reklamace/nova"
          className="rounded-lg border border-dt-blue px-4 py-2 text-sm font-medium text-dt-blue transition-colors hover:bg-dt-blue hover:text-white"
        >
          Nova reklamace
        </Link>
      </div>

      {/* Recent Orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Posledni objednavky
          </h2>
          <Link
            href="/portal/objednavky"
            className="text-sm text-dt-blue hover:underline"
          >
            Zobrazit vse
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="px-4 py-3 font-medium">Cislo</th>
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Stav</th>
                <th className="px-4 py-3 text-right font-medium">Castka</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/objednavky/${order.id}`}
                      className="font-medium text-dt-blue hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatAmount(order.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Unpaid Invoices */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Neuhrazene faktury
          </h2>
          <Link
            href="/portal/faktury"
            className="text-sm text-dt-blue hover:underline"
          >
            Zobrazit vse
          </Link>
        </div>
        <div className="space-y-3">
          {MOCK_UNPAID_INVOICES.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/portal/faktury/${invoice.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-dt-blue/30"
            >
              <div>
                <p className="font-medium text-neutral-900">
                  {invoice.invoiceNumber}
                </p>
                <p className="text-sm text-neutral-500">
                  Splatnost: {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-neutral-900">
                  {formatAmount(invoice.amount)}
                </p>
                {invoice.status === "overdue" && (
                  <p className="text-sm font-medium text-red-600">
                    Po splatnosti
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
