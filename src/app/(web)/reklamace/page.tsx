import Link from "next/link"
import { ClaimForm } from "@/components/forms/claim-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reklamace | Dlouhy Technology",
  description:
    "Podejte reklamaci na produkt nebo servis. Vyridime ji v zakonnem terminu.",
}

export default function ReklamacePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Reklamace</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-neutral-900">Reklamace</h1>
      <p className="mb-8 text-neutral-600">
        Vyplnte formular a my se vam ozveme s dalsim postupem.
      </p>

      <ClaimForm />
    </div>
  )
}
