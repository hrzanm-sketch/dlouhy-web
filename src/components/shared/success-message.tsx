import Link from "next/link"

interface SuccessMessageProps {
  title: string
  description: string
  details?: string[]
  backLink: {
    href: string
    label: string
  }
}

export function SuccessMessage({
  title,
  description,
  details,
  backLink,
}: SuccessMessageProps) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        {/* Green checkmark */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        <p className="mt-3 text-neutral-600">{description}</p>

        {details && details.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm text-neutral-500">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        <Link
          href={backLink.href}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-dt-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dt-blue-dark"
        >
          {backLink.label}
        </Link>
      </div>
    </section>
  )
}
