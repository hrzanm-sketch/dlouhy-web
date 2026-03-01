import type { Metadata } from "next"
import { Suspense } from "react"
import { OrdersTable, type Order } from "@/components/portal/orders-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"

export const metadata: Metadata = {
  title: "Objednavky",
}

// TODO: replace with real queries from intranet DB
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "OBJ-2026-0042",
    date: "2026-02-15",
    status: "shipped",
    amount: 1250000,
    itemCount: 3,
  },
  {
    id: "2",
    orderNumber: "OBJ-2026-0038",
    date: "2026-02-01",
    status: "completed",
    amount: 875000,
    itemCount: 1,
  },
  {
    id: "3",
    orderNumber: "OBJ-2026-0035",
    date: "2026-01-20",
    status: "completed",
    amount: 2340000,
    itemCount: 5,
  },
  {
    id: "4",
    orderNumber: "OBJ-2025-0198",
    date: "2025-12-10",
    status: "completed",
    amount: 456000,
    itemCount: 2,
  },
  {
    id: "5",
    orderNumber: "OBJ-2025-0187",
    date: "2025-11-28",
    status: "completed",
    amount: 1890000,
    itemCount: 4,
  },
]

const STATUS_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "pending", label: "Cekajici" },
  { value: "confirmed", label: "Potvrzeno" },
  { value: "shipped", label: "Odeslano" },
  { value: "completed", label: "Dokonceno" },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  // TODO: replace with real query, filtered and paginated
  const filtered = statusFilter
    ? MOCK_ORDERS.filter((o) => o.status === statusFilter)
    : MOCK_ORDERS

  const totalPages = Math.ceil(filtered.length / perPage)
  const orders = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Objednavky</h1>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <OrdersTable orders={orders} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
