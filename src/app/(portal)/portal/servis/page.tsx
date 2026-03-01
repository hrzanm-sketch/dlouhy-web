import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ServiceRequestsTable, type ServiceRequest } from "@/components/portal/service-requests-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"

export const metadata: Metadata = {
  title: "Servis",
}

// TODO: replace with real queries from intranet DB
const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "1",
    requestNumber: "SRV-2026-0012",
    date: "2026-02-20",
    type: "repair",
    urgency: "urgent",
    status: "in_progress",
    description: "Regulacni ventil SAMSON 3241 — netesnost ucpavky",
  },
  {
    id: "2",
    requestNumber: "SRV-2026-0009",
    date: "2026-02-05",
    type: "calibration",
    urgency: "normal",
    status: "completed",
    description: "Kalibrace pozicioneru 3730-2 — pravidelna udrzba",
  },
  {
    id: "3",
    requestNumber: "SRV-2026-0007",
    date: "2026-01-15",
    type: "inspection",
    urgency: "normal",
    status: "completed",
    description: "Inspekce recirkulacnich ventilu SCHROEDAHL — rocni kontrola",
  },
  {
    id: "4",
    requestNumber: "SRV-2025-0045",
    date: "2025-12-01",
    type: "installation",
    urgency: "normal",
    status: "completed",
    description: "Instalace SAMSON Type 3351 — nova linka v hale C",
  },
]

const STATUS_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "new", label: "Novy" },
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
  await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  // TODO: replace with real query, filtered and paginated
  const filtered = statusFilter
    ? MOCK_SERVICE_REQUESTS.filter((r) => r.status === statusFilter)
    : MOCK_SERVICE_REQUESTS

  const totalPages = Math.ceil(filtered.length / perPage)
  const requests = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

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
        <ServiceRequestsTable requests={requests} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
