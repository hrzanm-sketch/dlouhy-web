import Link from "next/link"
import { ContactForm } from "@/components/forms/contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt | Dlouhy Technology",
  description:
    "Kontaktujte Dlouhy Technology s.r.o. — vyhradni distributor SAMSON pro CR a SK. Sidlo Praha, servisni stredisko Usti nad Labem.",
}

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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact form */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            Napiste nam
          </h2>
          <ContactForm />
        </div>

        {/* Company info */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              Dlouhy Technology s.r.o.
            </h2>
            <div className="space-y-3 text-sm text-neutral-600">
              <div>
                <p className="font-medium text-neutral-700">Sidlo</p>
                <p>Touzimska 610/16</p>
                <p>197 00 Praha 9 — Kbely</p>
              </div>
              <div>
                <p className="font-medium text-neutral-700">Servisni stredisko</p>
                <p>Jateční 1531/6</p>
                <p>400 01 Ústí nad Labem</p>
              </div>
              <div>
                <p className="font-medium text-neutral-700">Telefon</p>
                <p>
                  <a href="tel:+420283932575" className="hover:text-dt-blue">
                    +420 283 932 575
                  </a>
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-700">Email</p>
                <p>
                  <a
                    href="mailto:info@dlouhy-technology.cz"
                    className="hover:text-dt-blue"
                  >
                    info@dlouhy-technology.cz
                  </a>
                </p>
              </div>
              <div>
                <p className="font-medium text-neutral-700">ICO</p>
                <p>27167658</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              Oteviraci doba
            </h3>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>Po — Pa: 8:00 — 16:30</p>
              <p>So — Ne: zavřeno</p>
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
