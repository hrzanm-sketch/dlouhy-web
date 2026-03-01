import Link from "next/link"
import { InquiryForm } from "@/components/forms/inquiry-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Poptavka | Dlouhy Technology",
  description:
    "Poptejte regulacni ventily SAMSON, recirkulacni ventily SCHROEDAHL/CIRCOR nebo horaky ELCO. Odpovime do 24 hodin.",
}

export default async function PoptavkaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const produkt =
    typeof params.produkt === "string" ? params.produkt : undefined

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Poptavka</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-neutral-900">Poptavka</h1>
      <p className="mb-8 text-neutral-600">
        Vyplnte formular a my se vam ozveme do 24 hodin.
      </p>

      {produkt && (
        <div className="mb-6 rounded-md border border-dt-blue/20 bg-dt-blue/5 px-4 py-3 text-sm text-dt-blue">
          Poptavka produktu: <strong>{produkt}</strong>
        </div>
      )}

      <InquiryForm />
    </div>
  )
}
