import Link from "next/link"
import { cn, formatDate } from "@/lib/utils"

export interface ServiceRequest {
  id: string
  requestNumber: string
  date: string
  type: string
  urgency: string
  status: string
  description: string
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nový",
  assigned: "Přiřazen",
  in_progress: "V realizaci",
  waiting_parts: "Čeká na díly",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  assigned: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  waiting_parts: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-800",
}

const TYPE_LABELS: Record<string, string> = {
  inspection: "Inspekce",
  repair: "Oprava",
  calibration: "Kalibrace",
  installation: "Instalace",
}

const URGENCY_LABELS: Record<string, string> = {
  normal: "Normální",
  low: "Nízká",
  high: "Vysoká",
  urgent: "Náhlé",
  critical: "Kritická",
}

const URGENCY_COLORS: Record<string, string> = {
  normal: "text-neutral-600",
  low: "text-neutral-500",
  high: "text-orange-600",
  urgent: "text-orange-600",
  critical: "text-red-600 font-semibold",
}

export function ServiceRequestsTable({ requests }: { requests: ServiceRequest[] }) {
  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-neutral-500">
        Žádné servisní požadavky k zobrazení.
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
            <th className="py-3 pr-4 font-medium">Typ</th>
            <th className="py-3 pr-4 font-medium">Naléhavost</th>
            <th className="py-3 pr-4 font-medium">Stav</th>
            <th className="py-3 font-medium">Popis</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
              <td className="py-3 pr-4">
                <Link href={`/portal/servis/${req.id}`} className="font-medium text-dt-blue hover:underline">
                  {req.requestNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-neutral-600">{formatDate(req.date)}</td>
              <td className="py-3 pr-4 text-neutral-600">{TYPE_LABELS[req.type]}</td>
              <td className="py-3 pr-4">
                <span className={cn("text-sm", URGENCY_COLORS[req.urgency])}>
                  {URGENCY_LABELS[req.urgency]}
                </span>
              </td>
              <td className="py-3 pr-4">
                <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_COLORS[req.status])}>
                  {STATUS_LABELS[req.status]}
                </span>
              </td>
              <td className="max-w-xs truncate py-3 text-neutral-600">{req.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
