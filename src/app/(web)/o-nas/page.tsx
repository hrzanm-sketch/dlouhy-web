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
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Spolehlivost",
    description:
      "Dodržujeme termíny a závazky. Naši zákazníci se na nás mohou spolehnout i v kritických situacích.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Partnerství",
    description:
      "Budujeme dlouhodobé vztahy se zákazníky i dodavateli. Společně hledáme optimální řešení.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    title: "Inovace",
    description:
      "Sledujeme nejnovější trendy v oboru a přinášíme moderní technologie pro efektivnější procesy.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
]

const OFFICES = [
  {
    city: "Praha",
    role: "Sídlo společnosti",
    address: "Dlouhý Technology s.r.o., Praha, Česká republika",
    type: "hq" as const,
  },
  {
    city: "Žilina",
    role: "Pobočka pro Slovensko",
    address: "Žilina, Slovenská republika",
    type: "branch" as const,
  },
  {
    city: "Tbilisi",
    role: "Pobočka pro Gruzii",
    address: "Tbilisi, Georgia",
    type: "branch" as const,
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
        <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
          Historie
        </h2>
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
        <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
          Naše hodnoty
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-neutral-200 bg-white p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dt-blue/10 text-dt-blue">
                {value.icon}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">
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
        <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
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
        <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
          Náš tým
        </h2>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          Náš tým tvoří zkušení obchodní zástupci, projektanti a servisní
          technici. Každý člen týmu je specialistou ve svém oboru a společně
          pokrýváme celý životní cyklus regulační techniky — od konzultace a
          návrhu, přes dodávku a montáž, až po servis a údržbu.
        </p>
      </section>

      {/* Kanceláře */}
      <section className="mt-12">
        <h2 className="border-l-4 border-dt-blue pl-4 text-2xl font-semibold text-neutral-900">
          Kanceláře
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {OFFICES.map((office) => (
            <div
              key={office.city}
              className="rounded-lg border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    office.type === "hq" ? "bg-green-500" : "bg-dt-blue"
                  }`}
                />
                <h3 className="text-lg font-semibold text-neutral-900">
                  {office.city}
                </h3>
              </div>
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
