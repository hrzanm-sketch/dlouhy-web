import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex min-h-[500px] items-center bg-gradient-to-br from-dt-blue-dark to-dt-blue lg:h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Regulační ventily, hořáky a průmyslový servis
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
            Výhradní distributor SAMSON pro Česko a Slovensko. Regulační
            a recirkulační ventily, hořáky ELCO, servis a náhradní díly.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/produkty"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-dt-blue transition-colors hover:bg-neutral-100"
            >
              Prohlédnout produkty
            </Link>
            <Link
              href="/poptavka"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              Poslat poptávku
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const PARTNERS: { name: string; colorClass: string; logo: string | null }[] = [
  { name: "SAMSON", colorClass: "text-samson-blue", logo: "/images/logos/samson.png" },
  { name: "SCHROEDAHL / CIRCOR", colorClass: "text-schroedahl-green", logo: null },
  { name: "ELCO", colorClass: "text-elco-red", logo: "/images/logos/elco.png" },
]

export function PartnerBar() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-center sm:gap-8 sm:px-6 lg:px-8">
        <span className="text-sm font-medium text-neutral-500">
          Autorizovaný distributor
        </span>
        <div className="flex items-center gap-8">
          {PARTNERS.map((partner) =>
            partner.logo ? (
              <Image
                key={partner.name}
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            ) : (
              <span
                key={partner.name}
                className={`text-sm font-bold ${partner.colorClass}`}
              >
                {partner.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  )
}
