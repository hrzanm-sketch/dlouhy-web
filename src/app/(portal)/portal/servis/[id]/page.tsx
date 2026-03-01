import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderTimeline } from "@/components/portal/order-timeline"
import { cn, formatDate } from "@/lib/utils"
import { getPortalSession } from "@/lib/portal/get-session"

type ServiceRequestDetail = {
  id: string
  requestNumber: string
  date: string
  type: "inspection" | "repair" | "calibration" | "installation"
  urgency: "normal" | "urgent" | "critical"
  status: "new" | "in_progress" | "waiting_parts" | "completed" | "cancelled"
  description: string
  product: string
  location: string
  contactPerson: string
  timeline: { date: string; status: string; description: string }[]
}

// TODO: replace with real query
const MOCK_DETAILS: Record<string, ServiceRequestDetail> = {
  "1": {
    id: "1",
    requestNumber: "SRV-2026-0012",
    date: "2026-02-20",
    type: "repair",
    urgency: "urgent",
    status: "in_progress",
    description: "Regulacni ventil SAMSON 3241 — netesnost ucpavky. Ventil vykazuje unik media pri tlaku nad 12 bar. Pozadujeme opravu nebo vymenu ucpavky.",
    product: "SAMSON Type 3241 DN50 PN40",
    location: "Hala B, linka 3",
    contactPerson: "Jan Novak",
    timeline: [
      { date: "2026-02-20", status: "Prijato", description: "Pozadavek prijat" },
      { date: "2026-02-21", status: "Posouzeno", description: "Technik posoudil — nutna vymena ucpavky" },
      { date: "2026-02-22", status: "V realizaci", description: "Objednany nahradni dily, predpokladany termin opravy 28.2." },
    ],
  },
  "2": {
    id: "2",
    requestNumber: "SRV-2026-0009",
    date: "2026-02-05",
    type: "calibration",
    urgency: "normal",
    status: "completed",
    description: "Kalibrace pozicioneru 3730-2 — pravidelna udrzba dle servisniho planu.",
    product: "SAMSON Pozicioner 3730-2",
    location: "Hala A, regulacni stanice",
    contactPerson: "Jan Novak",
    timeline: [
      { date: "2026-02-05", status: "Prijato", description: "Pozadavek prijat" },
      { date: "2026-02-07", status: "Naplanovano", description: "Servisni navsteva naplanovana na 10.2." },
      { date: "2026-02-10", status: "Provedeno", description: "Kalibrace provedena, protokol vystaven" },
      { date: "2026-02-10", status: "Dokonceno", description: "Pozadavek uzavren" },
    ],
  },
}

const TYPE_LABELS: Record<string, string> = {
  inspection: "Inspekce",
  repair: "Oprava",
  calibration: "Kalibrace",
  installation: "Instalace",
}

const URGENCY_LABELS: Record<string, string> = {
  normal: "Normalni",
  urgent: "Nahle",
  critical: "Kriticka",
}

const URGENCY_COLORS: Record<string, string> = {
  normal: "bg-neutral-100 text-neutral-800",
  urgent: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const STATUS_LABELS: Record<string, string> = {
  new: "Novy",
  in_progress: "V realizaci",
  waiting_parts: "Ceka na dily",
  completed: "Dokonceno",
  cancelled: "Zruseno",
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  waiting_parts: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-800",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const detail = MOCK_DETAILS[id]
  return {
    title: detail ? `Servis ${detail.requestNumber}` : "Pozadavek nenalezen",
  }
}

export default async function ServiceRequestDetailPage({
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
        href="/portal/servis"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na servisni pozadavky
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{detail.requestNumber}</h1>
          <p className="mt-1 text-sm text-neutral-500">{formatDate(detail.date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("inline-block rounded-full px-3 py-1 text-sm font-medium", URGENCY_COLORS[detail.urgency])}>
            {URGENCY_LABELS[detail.urgency]}
          </span>
          <span className={cn("inline-block rounded-full px-3 py-1 text-sm font-medium", STATUS_COLORS[detail.status])}>
            {STATUS_LABELS[detail.status]}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Stav pozadavku</h2>
          <OrderTimeline steps={detail.timeline} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Detail</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-neutral-500">Typ:</dt>
                <dd className="text-neutral-900">{TYPE_LABELS[detail.type]}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-neutral-500">Produkt:</dt>
                <dd className="text-neutral-900">{detail.product}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-neutral-500">Lokace:</dt>
                <dd className="text-neutral-900">{detail.location}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 shrink-0 font-medium text-neutral-500">Kontakt:</dt>
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
