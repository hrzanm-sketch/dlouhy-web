import type { Metadata } from "next"
import Link from "next/link"
import { getPortalSession } from "@/lib/portal/get-session"
import { ServiceRequestForm } from "./service-request-form"

export const metadata: Metadata = {
  title: "Novy servisni pozadavek",
}

export default async function NewServiceRequestPage() {
  await getPortalSession()

  return (
    <div className="space-y-6">
      <Link
        href="/portal/servis"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na servisni pozadavky
      </Link>

      <h1 className="text-2xl font-bold text-neutral-900">Novy servisni pozadavek</h1>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ServiceRequestForm />
      </div>
    </div>
  )
}
