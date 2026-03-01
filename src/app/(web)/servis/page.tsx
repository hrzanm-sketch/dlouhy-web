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
  },
  {
    title: "Diagnostika",
    description:
      "Komplexní diagnostika stavu regulačních ventilů včetně měření těsnosti, kontroly pohonů a vyhodnocení opotřebení interních dílů.",
  },
  {
    title: "Uvedení do provozu",
    description:
      "Profesionální montáž a zprovoznění regulačních ventilů, nastavení parametrů, kalibrace a zaškolení obsluhy.",
  },
  {
    title: "Havarijní servis",
    description:
      "Rychlý zásah při poruše regulační techniky. Garantované reakční doby dle sjednaného SLA pro minimalizaci prostojů.",
  },
]

const SLA_TIERS = [
  {
    level: "Standard",
    response: "48 hodin",
    description: "Běžné servisní požadavky a plánovaná údržba",
  },
  {
    level: "Priority",
    response: "24 hodin",
    description: "Požadavky s dopadem na provoz",
  },
  {
    level: "Critical",
    response: "4 hodiny",
    description: "Havarijní stavy s okamžitým dopadem na výrobu",
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
          <h2 className="text-2xl font-semibold text-neutral-900">
            Co nabízíme
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
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
          <h2 className="text-2xl font-semibold text-neutral-900">
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
                {SLA_TIERS.map((tier) => (
                  <tr key={tier.level}>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {tier.level}
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
          <h2 className="text-2xl font-semibold text-neutral-900">
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
