import Link from "next/link"
import { DtLogo } from "@/components/shared/dt-logo"
import { cn } from "@/lib/utils"

const QUICK_LINKS = [
  { label: "Produkty", href: "/produkty" },
  { label: "Servis", href: "/servis" },
  { label: "Reference", href: "/reference" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Poptavka", href: "/poptavka" },
  { label: "Reklamace", href: "/reklamace" },
  { label: "GDPR", href: "/gdpr" },
  { label: "Obchodni podminky", href: "/podminky" },
]

const PARTNERS = [
  { name: "SAMSON", color: "bg-samson-blue" },
  { name: "SCHROEDAHL / CIRCOR", color: "bg-schroedahl-green" },
  { name: "ELCO", color: "bg-elco-red" },
]

export function Footer() {
  return (
    <footer className="border-t-4 border-dt-blue bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3">
              <DtLogo className="h-7 text-white" />
            </div>
            <address className="mt-4 space-y-2 text-sm not-italic">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>Jinonická 759/24, 150 00 Praha 5</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <a href="tel:+420226800800" className="transition-colors hover:text-white">
                  +420 226 800 800
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:info@dlouhytechnology.com" className="transition-colors hover:text-white">
                  info@dlouhytechnology.com
                </a>
              </p>
            </address>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold text-white">Rychle odkazy</h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
                  >
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-lg font-bold text-white">Partneri</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {PARTNERS.map((partner) => (
                <span
                  key={partner.name}
                  className={cn(
                    "rounded px-3 py-1 text-sm font-medium text-white",
                    partner.color
                  )}
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-500">
            &copy; 2026 DLOUHY TECHNOLOGY s.r.o. Všechna práva vyhrazena.
            <span className="mx-2">·</span>
            <span className="text-neutral-400">Autorizovaný distributor SAMSON pro ČR a SK</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
