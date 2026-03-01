import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ServiceRequestsTable } from "@/components/portal/service-requests-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"
import { getServiceRequests } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Servis",
}

const STATUS_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "new", label: "Novy" },
  { value: "assigned", label: "Prirazen" },
  { value: "in_progress", label: "V realizaci" },
  { value: "waiting_parts", label: "Ceka na dily" },
  { value: "completed", label: "Dokonceno" },
  { value: "cancelled", label: "Zruseno" },
]

export default async function ServiceRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const allRequests = await getServiceRequests(session.companyId, statusFilter || undefined)
  const totalPages = Math.ceil(allRequests.length / perPage)
  const requests = allRequests.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Servisni pozadavky</h1>
        <Link
          href="/portal/servis/novy"
          className="rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
        >
          Novy pozadavek
        </Link>
      </div>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <ServiceRequestsTable requests={requests.map((r) => ({
          id: r.id,
          requestNumber: r.id.substring(0, 8),
          date: r.createdAt,
          type: "repair",
          urgency: r.priority,
          status: r.status,
          description: r.title,
        }))} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
