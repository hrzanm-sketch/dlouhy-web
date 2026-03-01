import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface ArticleCardProps {
  title: string
  perex: string
  category: string
  date: string
  slug: string
}

const CATEGORY_COLORS: Record<string, string> = {
  novinka: "bg-blue-100 text-blue-800",
  technika: "bg-green-100 text-green-800",
  produkt: "bg-purple-100 text-purple-800",
  akce: "bg-orange-100 text-orange-800",
}

const CATEGORY_LABELS: Record<string, string> = {
  novinka: "Novinka",
  technika: "Technika",
  produkt: "Produkt",
  akce: "Akce",
}

export function ArticleCard({
  title,
  perex,
  category,
  date,
  slug,
}: ArticleCardProps) {
  return (
    <Link
      href={`/novinky/${slug}`}
      className="group flex flex-col rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Thumbnail placeholder */}
      <div className="h-48 rounded-t-lg bg-neutral-200" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              CATEGORY_COLORS[category] ?? "bg-neutral-100 text-neutral-800"
            )}
          >
            {CATEGORY_LABELS[category] ?? category}
          </span>
          <span className="text-sm text-neutral-400">{formatDate(date)}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-neutral-900 group-hover:text-dt-blue">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-neutral-600">{perex}</p>
      </div>
    </Link>
  )
}
