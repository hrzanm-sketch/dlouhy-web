import Link from "next/link"
import { cn } from "@/lib/utils"

interface ReferenceCardProps {
  customer: string
  industry: string
  excerpt: string
  year: number
  slug: string
}

const INDUSTRY_COLORS: Record<string, string> = {
  teplarenstvi: "bg-orange-100 text-orange-800",
  energetika: "bg-blue-100 text-blue-800",
  chemie: "bg-green-100 text-green-800",
  prumysl: "bg-purple-100 text-purple-800",
  ostatni: "bg-neutral-100 text-neutral-800",
}

const INDUSTRY_LABELS: Record<string, string> = {
  teplarenstvi: "Teplárenství",
  energetika: "Energetika",
  chemie: "Chemie",
  prumysl: "Průmysl",
  ostatni: "Ostatní",
}

export function ReferenceCard({
  customer,
  industry,
  excerpt,
  year,
  slug,
}: ReferenceCardProps) {
  return (
    <Link
      href={`/reference/${slug}`}
      className="group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS.ostatni
          )}
        >
          {INDUSTRY_LABELS[industry] ?? industry}
        </span>
        <span className="text-sm text-neutral-400">{year}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900 group-hover:text-dt-blue">
        {customer}
      </h3>
      <p className="mt-2 text-sm text-neutral-600">{excerpt}</p>
    </Link>
  )
}
