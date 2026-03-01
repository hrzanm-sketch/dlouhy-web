import Link from "next/link"
import { cn } from "@/lib/utils"

interface KPICard {
  title: string
  count: number
  subtitle?: string
  subtitleWarning?: boolean
  href: string
}

export function KPICards({ cards }: { cards: KPICard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group rounded-lg border border-neutral-200 bg-white p-6 transition-colors hover:border-dt-blue/30"
        >
          <p className="text-sm font-medium text-neutral-500">{card.title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            {card.count}
          </p>
          {card.subtitle && (
            <p
              className={cn(
                "mt-1 text-sm",
                card.subtitleWarning ? "text-red-600" : "text-neutral-500"
              )}
            >
              {card.subtitle}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
