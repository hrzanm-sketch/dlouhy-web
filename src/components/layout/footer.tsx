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
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3">
              <DtLogo className="h-7 text-white" />
            </div>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p>Jinonická 759/24</p>
              <p>150 00 Praha 5</p>
              <p className="mt-3">
                <a
                  href="tel:+420226800800"
                  className="transition-colors hover:text-white"
                >
                  +420 226 800 800
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@dlouhytechnology.com"
                  className="transition-colors hover:text-white"
                >
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
                    className="text-sm transition-colors hover:text-white"
                  >
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
          </p>
        </div>
      </div>
    </footer>
  )
}
