import Link from "next/link"
import { ServiceForm } from "@/components/forms/service-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Poptavka servisu | Dlouhy Technology",
  description:
    "Poptejte servis regulacnich ventilu, recirkulacnich ventilu nebo horaku. Zajistujeme opravy, revize a udrzbu.",
}

export default function ServisPoptavkaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <Link href="/servis" className="hover:text-dt-blue">
          Servis
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Poptavka servisu</span>
      </nav>

      <h1 className="mb-2 text-3xl font-bold text-neutral-900">
        Poptavka servisu
      </h1>
      <p className="mb-8 text-neutral-600">
        Popiste vasi potrebu a my pripravime nabidku servisnich praci.
      </p>

      <ServiceForm />
    </div>
  )
}
