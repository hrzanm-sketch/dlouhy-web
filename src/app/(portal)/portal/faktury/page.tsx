import type { Metadata } from "next"
import { Suspense } from "react"
import { InvoicesTable } from "@/components/portal/invoices-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"
import { getInvoices } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Faktury",
}

const STATUS_OPTIONS = [
  { value: "", label: "Vše" },
  { value: "sent", label: "Neuhrazeno" },
  { value: "paid", label: "Uhrazeno" },
  { value: "overdue", label: "Po splatnosti" },
]

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const allInvoices = await getInvoices(session.companyId, statusFilter || undefined)
  const totalPages = Math.ceil(allInvoices.length / perPage)
  const invoices = allInvoices.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Faktury</h1>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <InvoicesTable invoices={invoices.map((i) => ({
          id: i.id,
          invoiceNumber: i.invoiceNumber,
          date: i.date,
          dueDate: i.dueDate,
          status: i.status,
          amount: i.amount,
        }))} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
