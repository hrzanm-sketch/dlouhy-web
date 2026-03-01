export function SpecsTable({
  parameters,
}: {
  parameters: { name: string; value: string; unit: string | null }[]
}) {
  if (parameters.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-neutral-900">
        Technicke parametry
      </h2>
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-3 text-left font-medium text-neutral-600">
                Parametr
              </th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">
                Hodnota
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {parameters.map((param, idx) => (
              <tr key={idx} className="even:bg-neutral-50 hover:bg-neutral-100">
                <td className="px-4 py-3 text-neutral-700">{param.name}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {param.value}
                  {param.unit && (
                    <span className="ml-1 text-neutral-500">{param.unit}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
