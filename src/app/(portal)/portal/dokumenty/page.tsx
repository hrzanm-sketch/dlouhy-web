import type { Metadata } from "next"
import { Suspense } from "react"
import { StatusFilter } from "@/components/portal/status-filter"
import { Pagination } from "@/components/ui/pagination"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getDocuments } from "@/lib/portal/queries"

export const metadata: Metadata = {
  title: "Dokumenty",
}

const CATEGORY_LABELS: Record<string, string> = {
  certificate: "Certifikat",
  protocol: "Protokol",
  manual: "Navod",
  report: "Zprava",
  catalog: "Katalog",
  datasheet: "Datasheet",
}

const CATEGORY_COLORS: Record<string, string> = {
  certificate: "bg-green-100 text-green-800",
  protocol: "bg-blue-100 text-blue-800",
  manual: "bg-purple-100 text-purple-800",
  report: "bg-yellow-100 text-yellow-800",
  catalog: "bg-neutral-100 text-neutral-800",
  datasheet: "bg-neutral-100 text-neutral-800",
}

const TYPE_OPTIONS = [
  { value: "", label: "Vse" },
  { value: "certificate", label: "Certifikaty" },
  { value: "protocol", label: "Protokoly" },
  { value: "manual", label: "Navody" },
  { value: "report", label: "Zpravy" },
  { value: "catalog", label: "Katalogy" },
  { value: "datasheet", label: "Datasheety" },
]

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  const session = await getPortalSession()
  const params = await searchParams
  const typeFilter = params.type || ""
  const currentPage = Number(params.page) || 1
  const perPage = 10

  const allDocuments = await getDocuments(session.companyId)
  const filtered = typeFilter
    ? allDocuments.filter((d) => d.category === typeFilter)
    : allDocuments

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
                  <th className="py-3 pr-4 font-medium">Kategorie</th>
                  <th className="py-3 pr-4 font-medium">Vyrobce</th>
                  <th className="py-3 font-medium">Velikost</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
                    <td className="py-3 pr-4">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-dt-blue hover:underline"
                      >
                        {doc.name}
                      </a>
                      {doc.description && (
                        <p className="mt-0.5 text-xs text-neutral-500">{doc.description}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", CATEGORY_COLORS[doc.category] || "bg-neutral-100 text-neutral-800")}>
                        {CATEGORY_LABELS[doc.category] || doc.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{doc.manufacturer}</td>
                    <td className="py-3 text-neutral-600">{formatFileSize(doc.fileSize)}</td>
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
