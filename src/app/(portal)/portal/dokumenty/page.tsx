import type { Metadata } from "next"
import { Suspense } from "react"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"

export const metadata: Metadata = {
  title: "Dokumenty",
}

type PortalDocument = {
  id: string
  name: string
  type: "certificate" | "protocol" | "manual" | "report" | "invoice"
  date: string
  size: string
  relatedTo: string
}

// TODO: replace with real query
const MOCK_DOCUMENTS: PortalDocument[] = [
  {
    id: "1",
    name: "Kalibracni protokol — Pozicioner 3730-2",
    type: "protocol",
    date: "2026-02-10",
    size: "1.2 MB",
    relatedTo: "SRV-2026-0009",
  },
  {
    id: "2",
    name: "Certifikat materialu — SAMSON 3241",
    type: "certificate",
    date: "2026-02-15",
    size: "0.8 MB",
    relatedTo: "OBJ-2026-0042",
  },
  {
    id: "3",
    name: "Navod k obsluze — SAMSON Type 3351",
    type: "manual",
    date: "2025-12-01",
    size: "4.5 MB",
    relatedTo: "OBJ-2025-0198",
  },
  {
    id: "4",
    name: "Servisni zprava — rocni kontrola SCHROEDAHL",
    type: "report",
    date: "2026-01-15",
    size: "2.1 MB",
    relatedTo: "SRV-2026-0007",
  },
  {
    id: "5",
    name: "Faktura FA-2026-0042",
    type: "invoice",
    date: "2026-02-20",
    size: "0.3 MB",
    relatedTo: "OBJ-2026-0042",
  },
]

const TYPE_LABELS: Record<PortalDocument["type"], string> = {
  certificate: "Certifikat",
  protocol: "Protokol",
  manual: "Navod",
  report: "Zprava",
  invoice: "Faktura",
}

const TYPE_COLORS: Record<PortalDocument["type"], string> = {
  certificate: "bg-green-100 text-green-800",
  protocol: "bg-blue-100 text-blue-800",
  manual: "bg-purple-100 text-purple-800",
  report: "bg-yellow-100 text-yellow-800",
  invoice: "bg-neutral-100 text-neutral-800",
}

const TYPE_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "certificate", label: "Certifikaty" },
  { value: "protocol", label: "Protokoly" },
  { value: "manual", label: "Navody" },
  { value: "report", label: "Zpravy" },
  { value: "invoice", label: "Faktury" },
]

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  await getPortalSession()
  const params = await searchParams
  const typeFilter = params.type || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const filtered = typeFilter
    ? MOCK_DOCUMENTS.filter((d) => d.type === typeFilter)
    : MOCK_DOCUMENTS

  const totalPages = Math.ceil(filtered.length / perPage)
  const documents = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dokumenty</h1>

      <Suspense fallback={null}>
        <StatusFilter options={TYPE_OPTIONS} paramName="type" />
      </Suspense>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        {documents.length === 0 ? (
          <p className="py-8 text-center text-neutral-500">Zadne dokumenty k zobrazeni.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-3 pr-4 font-medium">Nazev</th>
                  <th className="py-3 pr-4 font-medium">Typ</th>
                  <th className="py-3 pr-4 font-medium">Datum</th>
                  <th className="py-3 pr-4 font-medium">Velikost</th>
                  <th className="py-3 font-medium">Souvisejici</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
                    <td className="py-3 pr-4">
                      {/* TODO: link to actual file download */}
                      <button type="button" className="font-medium text-dt-blue hover:underline">
                        {doc.name}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", TYPE_COLORS[doc.type])}>
                        {TYPE_LABELS[doc.type]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{formatDate(doc.date)}</td>
                    <td className="py-3 pr-4 text-neutral-600">{doc.size}</td>
                    <td className="py-3 text-neutral-600">{doc.relatedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
