const STATS = [
  {
    number: "30+",
    label: "let zkušeností",
    description: "Na trhu od roku 1993",
  },
  {
    number: "500+",
    label: "realizací",
    description: "Projekty po celé ČR a SK",
  },
  {
    number: "24h",
    label: "servisní pohotovost",
    description: "Havarijní zásahy non-stop",
  },
  {
    number: "100%",
    label: "originální díly",
    description: "Přímo od výrobce",
  },
]

export function WhyDT() {
  return (
    <section className="bg-dt-blue-dark py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Proč Dlouhý Technology
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="relative text-center"
            >
              {idx > 0 && (
                <div className="absolute -left-4 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-white/20 lg:block" />
              )}
              <p className="text-4xl font-bold text-white sm:text-5xl">
                {stat.number}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-white/50">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
