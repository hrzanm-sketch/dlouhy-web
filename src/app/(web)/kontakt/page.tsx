import Link from "next/link"
import { ContactForm } from "@/components/forms/contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt | Dlouhy Technology",
  description:
    "Kontaktujte DLOUHY TECHNOLOGY s.r.o. — výhradní distributor SAMSON pro ČR a SK. Sídlo Praha, pobočky Žilina a Tbilisi.",
}

const CONTACT_CARDS = [
  {
    label: "Telefon",
    value: "+420 226 800 800",
    href: "tel:+420226800800",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "info@dlouhytechnology.com",
    href: "mailto:info@dlouhytechnology.com",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Adresa CZ",
    value: "Jinonická 759/24, 150 00 Praha 5",
    href: null,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    label: "Adresa SK",
    value: "Stárkova 7, 010 01 Žilina",
    href: null,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
]

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Kontakt</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Kontakt</h1>

      {/* Contact info cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-neutral-200 bg-white p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dt-blue/10 text-dt-blue">
              {card.icon}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              {card.label}
            </p>
            {card.href ? (
              <a href={card.href} className="mt-1 block text-sm font-medium text-neutral-900 hover:text-dt-blue">
                {card.value}
              </a>
            ) : (
              <p className="mt-1 text-sm font-medium text-neutral-900">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact form */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            Napiste nam
          </h2>
          <ContactForm />
        </div>

        {/* Additional info */}
        <div className="space-y-8">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              DLOUHY TECHNOLOGY s.r.o.
            </h2>
            <div className="space-y-2 text-sm text-neutral-600">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-medium text-neutral-700">IČO</span>
                <span>28498712</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-medium text-neutral-700">DIČ</span>
                <span>CZ28498712</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h3 className="mb-3 text-lg font-semibold text-neutral-900">
              Oteviraci doba
            </h3>
            <div className="space-y-1 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Po — Pa</span>
                <span className="font-medium text-neutral-900">8:00 — 16:30</span>
              </div>
              <div className="flex justify-between">
                <span>So — Ne</span>
                <span className="font-medium text-neutral-500">zavřeno</span>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 text-sm text-neutral-500">
            Mapa bude doplnena
          </div>
        </div>
      </div>
    </div>
  )
}
