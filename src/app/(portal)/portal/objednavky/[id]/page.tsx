import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderTimeline } from "@/components/portal/order-timeline"
import { cn, formatAmount, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getOrderById } from "@/lib/portal/queries"

const STATUS_LABELS: Record<string, string> = {
  ordered: "Objednáno",
  confirmed: "Potvrzeno",
  shipped: "Odesláno",
  delivered: "Dodáno",
  cancelled: "Zrušeno",
}

const STATUS_COLORS: Record<string, string> = {
  ordered: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  return {
    title: "Detail objednávky",
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getPortalSession()
  const { id } = await params
  const order = await getOrderById(session.companyId, id)

  if (!order) {
    notFound()
  }

  const timeline: { date: string; status: string; description: string }[] = []
  timeline.push({
    date: order.date,
    status: "Objednáno",
    description: `Objednávka ${order.orderNumber} přijata`,
  })
  if (order.confirmedAt) {
    timeline.push({
      date: order.confirmedAt,
      status: "Potvrzeno",
      description: order.deliveryDate
        ? `Potvrzeno, termín dodání ${formatDate(order.deliveryDate)}`
        : "Objednávka potvrzena",
    })
  }
  if (order.shippedAt) {
    timeline.push({
      date: order.shippedAt,
      status: "Odesláno",
      description: "Zásilka odeslána",
    })
  }
  if (order.deliveredAt) {
    timeline.push({
      date: order.deliveredAt,
      status: "Dodáno",
      description: "Zásilka doručena",
    })
  }

  return (
    <div className="space-y-8">
      <Link
        href="/portal/objednavky"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpět na objednávky
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {order.title}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            {formatDate(order.date)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800",
            )}
          >
            {STATUS_LABELS[order.status] || order.status}
          </span>
          <p className="text-xl font-bold text-neutral-900">
            {formatAmount(order.amount)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Stav objednávky
          </h2>
          <OrderTimeline steps={timeline} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Informace
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-neutral-500">Číslo objednávky</dt>
                <dd className="font-medium text-neutral-900">{order.orderNumber}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Částka</dt>
                <dd className="font-medium text-neutral-900">{formatAmount(order.amount)}</dd>
              </div>
              {order.deliveryDate && (
                <div>
                  <dt className="text-neutral-500">Termín dodání</dt>
                  <dd className="font-medium text-neutral-900">{formatDate(order.deliveryDate)}</dd>
                </div>
              )}
              {order.note && (
                <div>
                  <dt className="text-neutral-500">Poznámka</dt>
                  <dd className="text-neutral-700">{order.note}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
