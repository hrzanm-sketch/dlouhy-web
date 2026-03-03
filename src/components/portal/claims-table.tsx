import Link from "next/link"
import { cn, formatDate } from "@/lib/utils"

export interface Claim {
  id: string
  claimNumber: string
  date: string
  product: string
  desiredResolution: string
  status: string
  description: string
}

const STATUS_LABELS: Record<string, string> = {
  received: "Přijato",
  evaluating: "V šetření",
  sent_to_supplier: "U dodavatele",
  resolved: "Vyřešeno",
  rejected: "Zamítnuto",
  new: "Nová",
  investigating: "V šetření",
  approved: "Schváleno",
}

const STATUS_COLORS: Record<string, string> = {
  received: "bg-blue-100 text-blue-800",
  evaluating: "bg-yellow-100 text-yellow-800",
  sent_to_supplier: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  new: "bg-blue-100 text-blue-800",
  investigating: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
}

const RESOLUTION_LABELS: Record<string, string> = {
  repair: "Oprava",
  replacement: "Výměna",
  refund: "Vrácení peněz",
  discount: "Sleva",
}

export function ClaimsTable({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        Žádné reklamace k zobrazení.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="py-3 pr-4 font-medium">Číslo</th>
            <th className="py-3 pr-4 font-medium">Datum</th>
            <th className="py-3 pr-4 font-medium">Produkt</th>
            <th className="py-3 pr-4 font-medium">Požadované řešení</th>
            <th className="py-3 font-medium">Stav</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
              <td className="py-3 pr-4">
                <Link href={`/portal/reklamace/${claim.id}`} className="font-medium text-dt-blue hover:underline">
                  {claim.claimNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-neutral-600">{formatDate(claim.date)}</td>
              <td className="py-3 pr-4 text-neutral-600">{claim.product}</td>
              <td className="py-3 pr-4 text-neutral-600">{RESOLUTION_LABELS[claim.desiredResolution]}</td>
              <td className="py-3">
                <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_COLORS[claim.status])}>
                  {STATUS_LABELS[claim.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
