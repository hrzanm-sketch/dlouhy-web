import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getServiceRequestById } from "@/lib/portal/queries"

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
  cancelled: "bg-red-100 text-red-800",
}

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Kritická",
  high: "Vysoká",
  normal: "Normální",
  low: "Nízká",
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  normal: "bg-neutral-100 text-neutral-800",
  low: "bg-neutral-50 text-neutral-600",
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Detail servisního požadavku",
  }
}

export default async function ServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getPortalSession()
  const { id } = await params
  const request = await getServiceRequestById(session.companyId, id)

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link
        href="/portal/servis"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpět na servisní požadavky
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {request.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Vytvořeno: {formatDate(request.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              PRIORITY_COLORS[request.priority] || "bg-neutral-100 text-neutral-800",
            )}
          >
            {PRIORITY_LABELS[request.priority] || request.priority}
          </span>
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-sm font-medium",
              STATUS_COLORS[request.status] || "bg-neutral-100 text-neutral-800",
            )}
          >
            {STATUS_LABELS[request.status] || request.status}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Informace
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Priorita</dt>
              <dd className="font-medium text-neutral-900">
                {PRIORITY_LABELS[request.priority] || request.priority}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Stav</dt>
              <dd className="font-medium text-neutral-900">
                {STATUS_LABELS[request.status] || request.status}
              </dd>
            </div>
            {request.scheduledDate && (
              <div>
                <dt className="text-neutral-500">Naplánováno na</dt>
                <dd className="font-medium text-neutral-900">
                  {formatDate(request.scheduledDate)}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-neutral-500">Vytvořeno</dt>
              <dd className="font-medium text-neutral-900">
                {formatDate(request.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Popis
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {request.description || "Bez popisu."}
          </p>
        </div>
      </div>
    </div>
  )
}
