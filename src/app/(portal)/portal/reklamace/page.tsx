import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ClaimsTable } from "@/components/portal/claims-table"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { getPortalSession } from "@/lib/portal/get-session"
import { getClaims } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Reklamace",
}

const STATUS_OPTIONS = [
  { value: "", label: "Vše" },
  { value: "received", label: "Přijato" },
  { value: "evaluating", label: "V šetření" },
  { value: "sent_to_supplier", label: "U dodavatele" },
  { value: "resolved", label: "Vyřešeno" },
  { value: "rejected", label: "Zamítnuto" },
]

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getPortalSession()
  const params = await searchParams
  const statusFilter = params.status || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const allClaims = await getClaims(session.companyId, statusFilter || undefined)
  const totalPages = Math.ceil(allClaims.length / perPage)
  const claims = allClaims.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Reklamace</h1>
        <Link
          href="/portal/reklamace/nova"
          className="rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
        >
          Nová reklamace
        </Link>
      </div>

      <Suspense fallback={null}>
        <StatusFilter options={STATUS_OPTIONS} paramName="status" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <ClaimsTable claims={claims.map((c) => ({
          id: c.id,
          claimNumber: c.id.substring(0, 8),
          date: c.createdAt,
          product: c.title,
          desiredResolution: "repair",
          status: c.status,
          description: c.description || c.title,
        }))} />
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
