import type { Metadata } from "next"
import { Suspense } from "react"
import { OrdersTable } from "@/components/portal/orders-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"
import { getOrders } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Objednávky",
}

const STATUS_OPTIONS = [
  { value: "", label: "Vše" },
  { value: "ordered", label: "Objednáno" },
  { value: "confirmed", label: "Potvrzeno" },
  { value: "shipped", label: "Odesláno" },
  { value: "delivered", label: "Dodáno" },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const allOrders = await getOrders(session.companyId, statusFilter || undefined)
  const totalPages = Math.ceil(allOrders.length / perPage)
  const orders = allOrders.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Objednávky</h1>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <OrdersTable orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          date: o.date,
          status: o.status,
          amount: o.amount,
          itemCount: 0,
        }))} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
