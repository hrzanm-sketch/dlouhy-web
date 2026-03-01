import Link from "next/link"
import { HeroCanvas } from "@/components/shared/hero-canvas"

export function Hero() {
  return (
    <section className="relative flex min-h-[500px] items-center overflow-hidden bg-black lg:h-[70vh]">
      <HeroCanvas className="absolute inset-0 h-full w-full" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="mb-4 block text-sm uppercase tracking-widest text-white/60">
            Autorizovaný distributor SAMSON
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Regulační ventily,
            <br className="hidden sm:block" />
            hořáky a průmyslový servis
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
            Výhradní distributor SAMSON pro Česko a Slovensko. Regulační
            a recirkulační ventily, hořáky ELCO, servis a náhradní díly.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/produkty"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-medium text-dt-blue transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-100"
            >
              Prohlédnout produkty
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/poptavka"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              Poslat poptávku
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center text-white/40">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

const PARTNERS = [
  { name: "SAMSON", colorClass: "text-samson-blue" },
  { name: "SCHROEDAHL / CIRCOR", colorClass: "text-schroedahl-green" },
  { name: "ELCO", colorClass: "text-elco-red" },
]

export function PartnerBar() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-100 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-center sm:gap-8 sm:px-6 lg:px-8">
        <span className="text-sm font-medium text-neutral-500">
          Autorizovaný distributor
        </span>
        <div className="flex items-center gap-4 sm:gap-8">
          {PARTNERS.map((partner, idx) => (
            <span key={partner.name} className="flex items-center gap-4 sm:gap-8">
              {idx > 0 && (
                <span className="text-neutral-300">|</span>
              )}
              <span className={`text-lg font-bold tracking-tight ${partner.colorClass}`}>
                {partner.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
