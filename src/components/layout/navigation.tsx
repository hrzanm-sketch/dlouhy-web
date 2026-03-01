"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function NavItems({
  className,
  itemClassName,
  onClick,
}: {
  className?: string
  itemClassName?: string
  onClick?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "text-sm font-medium transition-colors",
              isActive
                ? "text-dt-blue border-b-2 border-dt-blue pb-0.5"
                : "text-neutral-600 hover:text-dt-blue",
              itemClassName
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
