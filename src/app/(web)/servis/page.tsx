import type { Metadata } from "next"
import { CTABlock } from "@/components/shared/cta-block"

export const metadata: Metadata = {
  title: "Servisní služby",
  description:
    "Kompletní servis regulačních ventilů SAMSON, SCHROEDAHL a ELCO. Údržba, diagnostika, uvedení do provozu, havarijní servis.",
}

const SERVICES = [
  {
    title: "Pravidelná údržba",
    description:
      "Preventivní údržba regulačních ventilů a armatur dle doporučených intervalů výrobce. Prodlužuje životnost a zajišťuje spolehlivý provoz.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
      </svg>
    ),
  },
  {
    title: "Diagnostika",
    description:
      "Komplexní diagnostika stavu regulačních ventilů včetně měření těsnosti, kontroly pohonů a vyhodnocení opotřebení interních dílů.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    title: "Uvedení do provozu",
    description:
      "Profesionální montáž a zprovoznění regulačních ventilů, nastavení parametrů, kalibrace a zaškolení obsluhy.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
      </svg>
    ),
  },
  {
    title: "Havarijní servis",
    description:
      "Rychlý zásah při poruše regulační techniky. Garantované reakční doby dle sjednaného SLA pro minimalizaci prostojů.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
]

const SLA_TIERS = [
  {
    level: "Standard",
    response: "48 hodin",
    description: "Běžné servisní požadavky a plánovaná údržba",
    color: "bg-neutral-100 text-neutral-700",
  },
  {
    level: "Priority",
    response: "24 hodin",
    description: "Požadavky s dopadem na provoz",
    color: "bg-amber-100 text-amber-800",
  },
  {
    level: "Critical",
    response: "4 hodiny",
    description: "Havarijní stavy s okamžitým dopadem na výrobu",
    color: "bg-red-100 text-red-800",
  },
]

export default function ServisPage() {
  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
          Servisní služby
        </h1>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          Poskytujeme kompletní servis regulačních ventilů a průmyslových armatur
          značek SAMSON, SCHROEDAHL/CIRCOR a ELCO. Od pravidelné údržby po
          havarijní zásahy — postaráme se o spolehlivý chod vaší technologie.
        </p>

        {/* Services */}
        <section className="mt-12">
          <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
            Co nabízíme
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-neutral-200 border-t-[3px] border-t-dt-blue bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dt-blue/10 text-dt-blue">
                  {service.icon}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SLA */}
        <section className="mt-12">
          <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
            Reakční doby (SLA)
          </h2>
          <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-6 py-3 text-sm font-semibold text-neutral-900">
                    Úroveň
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-neutral-900">
                    Reakční doba
                  </th>
                  <th className="hidden px-6 py-3 text-sm font-semibold text-neutral-900 sm:table-cell">
                    Popis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {SLA_TIERS.map((tier, idx) => (
                  <tr key={tier.level} className={idx % 2 === 1 ? "bg-neutral-50" : ""}>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tier.color}`}>
                        {tier.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-dt-blue">
                      {tier.response}
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-neutral-600 sm:table-cell">
                      {tier.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Coverage */}
        <section className="mt-12">
          <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
            Pokrytí
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            Servisní služby poskytujeme na celém území České republiky a
            Slovenské republiky. Pro klíčové zákazníky zajišťujeme servis i v
            dalších zemích střední a východní Evropy.
          </p>
        </section>
      </article>

      <CTABlock
        title="Potřebujete servis?"
        description="Popište nám váš požadavek a my se vám ozveme s nabídkou"
        buttonText="Poptat servis"
        buttonHref="/servis/poptavka"
      />
    </>
  )
}
