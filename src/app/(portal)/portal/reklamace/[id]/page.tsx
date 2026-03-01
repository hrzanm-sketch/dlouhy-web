import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderTimeline } from "@/components/portal/order-timeline"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"

type ClaimDetail = {
  id: string
  claimNumber: string
  date: string
  product: string
  orderNumber: string
  desiredResolution: "repair" | "replacement" | "refund" | "discount"
  status: "new" | "investigating" | "approved" | "rejected" | "resolved"
  description: string
  contactPerson: string
  timeline: { date: string; status: string; description: string }[]
}

// TODO: replace with real query
const MOCK_DETAILS: Record<string, ClaimDetail> = {
  "1": {
    id: "1",
    claimNumber: "REC-2026-0003",
    date: "2026-02-10",
    product: "SAMSON Type 3241 DN80",
    orderNumber: "OBJ-2025-0187",
    desiredResolution: "repair",
    status: "investigating",
    description: "Ventil nevykazuje spravnou regulaci — odchylka od nastavene hodnoty >5%. Problem se projevuje pri tlaku nad 10 bar. Ventil byl instalovan v prosinci 2025.",
    contactPerson: "Jan Novak",
    timeline: [
      { date: "2026-02-10", status: "Prijato", description: "Reklamace prijata" },
      { date: "2026-02-12", status: "V setreni", description: "Technik naplanovany na mistni setreni 15.2." },
      { date: "2026-02-15", status: "Posouzeno", description: "Zjistena vadna ucpavka — bude vymenena v ramci zaruky" },
    ],
  },
  "2": {
    id: "2",
    claimNumber: "REC-2025-0018",
    date: "2025-11-20",
    product: "Pozicioner SAMSON 3730-3",
    orderNumber: "OBJ-2025-0165",
    desiredResolution: "replacement",
    status: "resolved",
    description: "Vadny display pozicioneru — nezobrazuje aktualni pozici. Display zacal blikat po 2 mesicich provozu a nasledne zcela prestal fungovat.",
    contactPerson: "Jan Novak",
    timeline: [
      { date: "2025-11-20", status: "Prijato", description: "Reklamace prijata" },
      { date: "2025-11-22", status: "Schvaleno", description: "Reklamace uznana — vymena pozicioneru" },
      { date: "2025-12-01", status: "Vyreseno", description: "Novy pozicioner dorucen a instalovan" },
    ],
  },
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nova",
  investigating: "V setreni",
  approved: "Schvaleno",
  rejected: "Zamitnuto",
  resolved: "Vyreseno",
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  investigating: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  resolved: "bg-neutral-100 text-neutral-800",
}

const RESOLUTION_LABELS: Record<string, string> = {
  repair: "Oprava",
  replacement: "Vymena",
  refund: "Vraceni penez",
  discount: "Sleva",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const detail = MOCK_DETAILS[id]
  return {
    title: detail ? `Reklamace ${detail.claimNumber}` : "Reklamace nenalezena",
  }
}

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await getPortalSession()
  const { id } = await params
  const detail = MOCK_DETAILS[id]

  if (!detail) {
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
          <h1 className="text-2xl font-bold text-neutral-900">{detail.claimNumber}</h1>
          <p className="mt-1 text-sm text-neutral-500">{formatDate(detail.date)}</p>
        </div>
        <span className={cn("inline-block rounded-full px-3 py-1 text-sm font-medium", STATUS_COLORS[detail.status])}>
          {STATUS_LABELS[detail.status]}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Stav reklamace</h2>
          <OrderTimeline steps={detail.timeline} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Detail</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2">
                <dt className="w-40 shrink-0 font-medium text-neutral-500">Produkt:</dt>
                <dd className="text-neutral-900">{detail.product}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-40 shrink-0 font-medium text-neutral-500">Objednavka:</dt>
                <dd className="text-neutral-900">{detail.orderNumber}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-40 shrink-0 font-medium text-neutral-500">Pozadovane reseni:</dt>
                <dd className="text-neutral-900">{RESOLUTION_LABELS[detail.desiredResolution]}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-40 shrink-0 font-medium text-neutral-500">Kontakt:</dt>
                <dd className="text-neutral-900">{detail.contactPerson}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Popis</h2>
            <p className="text-sm leading-relaxed text-neutral-700">{detail.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
