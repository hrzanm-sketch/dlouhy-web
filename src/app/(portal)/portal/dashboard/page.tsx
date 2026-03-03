import type { Metadata } from "next"
import Link from "next/link"
import { KPICards } from "@/components/portal/kpi-cards"
import { formatAmount, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getDashboardData } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Dashboard",
}

const STATUS_LABELS: Record<string, string> = {
  ordered: "Objednáno",
  confirmed: "Potvrzeno",
  shipped: "Odesláno",
  delivered: "Dodáno",
}

export default async function DashboardPage() {
  const session = await getPortalSession()
  const data = await getDashboardData(session.companyId)

  const kpiCards = [
    {
      title: "Objednávky",
      count: data.ordersCount,
      href: "/portal/objednavky",
    },
    {
      title: "Faktury",
      count: data.invoicesCount,
      subtitle: data.unpaidInvoices.length > 0
        ? `${data.unpaidInvoices.length} neuhrazeno`
        : undefined,
      subtitleWarning: data.unpaidInvoices.some((i) => i.status === "overdue"),
      href: "/portal/faktury",
    },
    {
      title: "Servis",
      count: data.serviceCount,
      href: "/portal/servis",
    },
    {
      title: "Reklamace",
      count: data.claimsCount,
      href: "/portal/reklamace",
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      <KPICards cards={kpiCards} />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/portal/servis/novy"
          className="rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-dark"
        >
          Nový servisní požadavek
        </Link>
        <Link
          href="/portal/reklamace/nova"
          className="rounded-lg border border-dt-blue px-4 py-2 text-sm font-medium text-dt-blue transition-colors hover:bg-dt-blue hover:text-white"
        >
          Nová reklamace
        </Link>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Poslední objednávky
          </h2>
          <Link
            href="/portal/objednavky"
            className="text-sm text-dt-blue hover:underline"
          >
            Zobrazit vše
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="px-4 py-3 font-medium">Číslo</th>
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Stav</th>
                <th className="px-4 py-3 text-right font-medium">Částka</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
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
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    Žádné objednávky
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Neuhrazené faktury
          </h2>
          <Link
            href="/portal/faktury"
            className="text-sm text-dt-blue hover:underline"
          >
            Zobrazit vše
          </Link>
        </div>
        <div className="space-y-3">
          {data.unpaidInvoices.map((invoice) => (
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
          {data.unpaidInvoices.length === 0 && (
            <p className="text-sm text-neutral-500">Vše uhrazeno.</p>
          )}
        </div>
      </section>
    </div>
  )
}
