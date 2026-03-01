import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ClaimsTable, type Claim } from "@/components/portal/claims-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"

export const metadata: Metadata = {
  title: "Reklamace",
}

// TODO: replace with real queries from intranet DB
const MOCK_CLAIMS: Claim[] = [
  {
    id: "1",
    claimNumber: "REC-2026-0003",
    date: "2026-02-10",
    product: "SAMSON Type 3241 DN80",
    desiredResolution: "repair",
    status: "investigating",
    description: "Ventil nevykazuje spravnou regulaci — odchylka od nastavene hodnoty >5%",
  },
  {
    id: "2",
    claimNumber: "REC-2025-0018",
    date: "2025-11-20",
    product: "Pozicioner SAMSON 3730-3",
    desiredResolution: "replacement",
    status: "resolved",
    description: "Vadny display pozicioneru — nezobrazuje aktualni pozici",
  },
  {
    id: "3",
    claimNumber: "REC-2025-0015",
    date: "2025-10-05",
    product: "SCHROEDAHL TDM",
    desiredResolution: "discount",
    status: "resolved",
    description: "Dodany ventil s kosmitickym poskozenim — skrabance na tele ventilu",
  },
]

const STATUS_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "new", label: "Nova" },
  { value: "investigating", label: "V setreni" },
  { value: "approved", label: "Schvaleno" },
  { value: "rejected", label: "Zamitnuto" },
  { value: "resolved", label: "Vyreseno" },
]

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const filtered = statusFilter
    ? MOCK_CLAIMS.filter((c) => c.status === statusFilter)
    : MOCK_CLAIMS

  const totalPages = Math.ceil(filtered.length / perPage)
  const claims = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Reklamace</h1>
        <Link
          href="/portal/reklamace/nova"
          className="rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
        >
          Nova reklamace
        </Link>
      </div>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <ClaimsTable claims={claims} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
