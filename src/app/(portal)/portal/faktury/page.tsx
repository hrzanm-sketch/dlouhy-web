import type { Metadata } from "next"
import { Suspense } from "react"
import { InvoicesTable, type Invoice } from "@/components/portal/invoices-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"

export const metadata: Metadata = {
  title: "Faktury",
}

// TODO: replace with real queries from intranet DB
const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "FA-2026-0042",
    date: "2026-02-20",
    dueDate: "2026-03-20",
    status: "unpaid",
    amount: 1250000,
  },
  {
    id: "2",
    invoiceNumber: "FA-2026-0038",
    date: "2026-02-05",
    dueDate: "2026-03-05",
    status: "paid",
    amount: 875000,
  },
  {
    id: "3",
    invoiceNumber: "FA-2026-0035",
    date: "2026-01-25",
    dueDate: "2026-02-25",
    status: "overdue",
    amount: 2340000,
  },
]

const STATUS_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "unpaid", label: "Neuhrazeno" },
  { value: "paid", label: "Uhrazeno" },
  { value: "overdue", label: "Po splatnosti" },
]

export default async function InvoicesPage({
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
    ? MOCK_INVOICES.filter((i) => i.status === statusFilter)
    : MOCK_INVOICES

  const totalPages = Math.ceil(filtered.length / perPage)
  const invoices = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Faktury</h1>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <InvoicesTable invoices={invoices} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
