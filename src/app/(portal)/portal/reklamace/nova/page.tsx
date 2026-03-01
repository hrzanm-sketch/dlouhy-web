import type { Metadata } from "next"
import Link from "next/link"
import { getPortalSession } from "@/lib/portal/get-session"
import { ClaimForm } from "./claim-form"

export const metadata: Metadata = {
  title: "Nova reklamace",
}

export default async function NewClaimPage() {
  await getPortalSession()

  return (
    <div className="space-y-6">
      <Link
        href="/portal/reklamace"
        className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700"
      >
        &larr; Zpet na reklamace
      </Link>

      <h1 className="text-2xl font-bold text-neutral-900">Nova reklamace</h1>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ClaimForm />
      </div>
    </div>
  )
}
