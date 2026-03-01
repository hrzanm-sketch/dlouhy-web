import { cn } from "@/lib/utils"

const typeBadgeColors: Record<string, string> = {
  datasheet: "bg-blue-100 text-blue-700",
  manual: "bg-green-100 text-green-700",
  certificate: "bg-yellow-100 text-yellow-700",
  drawing: "bg-purple-100 text-purple-700",
  brochure: "bg-pink-100 text-pink-700",
}

const typeLabels: Record<string, string> = {
  datasheet: "Datasheet",
  manual: "Manual",
  certificate: "Certifikat",
  drawing: "Vykres",
  brochure: "Brozura",
}

export function DocumentsTable({
  documents,
}: {
  documents: {
    name: string
    type: string
    language: string | null
    fileUrl: string
    fileSize: number | null
  }[]
}) {
  if (documents.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-neutral-900">
        Dokumenty ke stazeni
      </h2>
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-3 text-left font-medium text-neutral-600">
                Nazev
              </th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">
                Typ
              </th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">
                Jazyk
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">
                Stahnout
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {documents.map((doc, idx) => (
              <tr key={idx} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-neutral-900">{doc.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-medium",
                      typeBadgeColors[doc.type] ?? "bg-neutral-100 text-neutral-600"
                    )}
                  >
                    {typeLabels[doc.type] ?? doc.type}
                  </span>
                </td>
                <td className="px-4 py-3 uppercase text-neutral-500">
                  {doc.language ?? "cs"}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dt-blue hover:underline"
                  >
                    Stahnout
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
