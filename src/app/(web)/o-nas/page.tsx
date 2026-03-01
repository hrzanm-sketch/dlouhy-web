import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "O společnosti",
  description:
    "Dlouhý Technology s.r.o. — výhradní distributor SAMSON pro ČR a SK. Více než 30 let zkušeností v regulační technice.",
}

const VALUES = [
  {
    title: "Odbornost",
    description:
      "Tým certifikovaných specialistů s hlubokými znalostmi regulační techniky a průmyslových procesů.",
  },
  {
    title: "Spolehlivost",
    description:
      "Dodržujeme termíny a závazky. Naši zákazníci se na nás mohou spolehnout i v kritických situacích.",
  },
  {
    title: "Partnerství",
    description:
      "Budujeme dlouhodobé vztahy se zákazníky i dodavateli. Společně hledáme optimální řešení.",
  },
  {
    title: "Inovace",
    description:
      "Sledujeme nejnovější trendy v oboru a přinášíme moderní technologie pro efektivnější procesy.",
  },
]

const OFFICES = [
  {
    city: "Praha",
    role: "Sídlo společnosti",
    address: "Dlouhý Technology s.r.o., Praha, Česká republika",
  },
  {
    city: "Žilina",
    role: "Pobočka pro Slovensko",
    address: "Žilina, Slovenská republika",
  },
  {
    city: "Tbilisi",
    role: "Pobočka pro Gruzii",
    address: "Tbilisi, Georgia",
  },
]

export default function ONasPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        O společnosti
      </h1>

      {/* Historie */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-neutral-900">Historie</h2>
        <div className="mt-4 space-y-4 text-neutral-600 leading-relaxed">
          <p>
            Společnost Dlouhý Technology byla založena v roce 1993. Více než 30
            let poskytujeme služby v oblasti regulační techniky pro průmyslové
            procesy.
          </p>
          <p>
            Jako výhradní distributor SAMSON pro Českou republiku a Slovensko
            zajišťujeme dodávky regulačních ventilů, pohonů a příslušenství pro
            klíčová průmyslová odvětví. Dále zastupujeme značky SCHROEDAHL/CIRCOR
            (recirkulační ventily) a ELCO (průmyslové hořáky).
          </p>
          <p>
            Za dobu naší existence jsme realizovali stovky projektů pro
            teplárenství, energetiku, chemický průmysl a další odvětví. Naše
            zkušenosti a odbornost nám umožňují poskytovat komplexní služby od
            návrhu po servis.
          </p>
        </div>
      </section>

      {/* Hodnoty */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Naše hodnoty
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifikace */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Certifikace
        </h2>
        <div className="mt-4 space-y-3 text-neutral-600 leading-relaxed">
          <p>
            Disponujeme certifikací ISO 9001 pro systém managementu kvality a
            jsme autorizovaným partnerem SAMSON AG pro Českou republiku a
            Slovensko.
          </p>
          <p>
            Naši technici pravidelně procházejí školeními u výrobců, aby vám
            mohli nabídnout nejkvalitnější servis a poradenství.
          </p>
        </div>
      </section>

      {/* Tým */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-neutral-900">Náš tým</h2>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          Náš tým tvoří zkušení obchodní zástupci, projektanti a servisní
          technici. Každý člen týmu je specialistou ve svém oboru a společně
          pokrýváme celý životní cyklus regulační techniky — od konzultace a
          návrhu, přes dodávku a montáž, až po servis a údržbu.
        </p>
      </section>

      {/* Kanceláře */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-neutral-900">Kanceláře</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {OFFICES.map((office) => (
            <div
              key={office.city}
              className="rounded-lg border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                {office.city}
              </h3>
              <p className="mt-1 text-sm font-medium text-dt-blue">
                {office.role}
              </p>
              <p className="mt-2 text-sm text-neutral-500">{office.address}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
