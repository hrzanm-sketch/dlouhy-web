import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"
import { getClaimById } from "@/lib/portal/queries"

const STATUS_LABELS: Record<string, string> = {
  received: "Prijato",
  evaluating: "V setreni",
  sent_to_supplier: "U dodavatele",
  resolved: "Vyreseno",
  rejected: "Zamitnuto",
}

const STATUS_COLORS: Record<string, string> = {
  received: "bg-blue-100 text-blue-800",
  evaluating: "bg-yellow-100 text-yellow-800",
  sent_to_supplier: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Detail reklamace",
  }
}

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getPortalSession()
  const { id } = await params
  const claim = await getClaimById(session.companyId, id)

  if (!claim) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link
        href="/portal/reklamace"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na reklamace
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {claim.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Vytvoreno: {formatDate(claim.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-sm font-medium",
            STATUS_COLORS[claim.status] || "bg-neutral-100 text-neutral-800",
          )}
        >
          {STATUS_LABELS[claim.status] || claim.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Informace
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Stav</dt>
              <dd className="font-medium text-neutral-900">
                {STATUS_LABELS[claim.status] || claim.status}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Vytvoreno</dt>
              <dd className="font-medium text-neutral-900">
                {formatDate(claim.createdAt)}
              </dd>
            </div>
            {claim.resolvedAt && (
              <div>
                <dt className="text-neutral-500">Vyreseno</dt>
                <dd className="font-medium text-green-700">
                  {formatDate(claim.resolvedAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Popis
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {claim.description || "Bez popisu."}
          </p>
        </div>
      </div>
    </div>
  )
}
