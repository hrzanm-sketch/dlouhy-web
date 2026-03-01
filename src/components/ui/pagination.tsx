"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function pageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(page))
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  // Show a window of pages around the current page
  const pages: (number | "ellipsis")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Strankovani">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          Predchozi
        </Link>
      ) : (
        <span className="rounded-md px-3 py-2 text-sm text-neutral-300">
          Predchozi
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              p === currentPage
                ? "bg-dt-blue font-medium text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          Dalsi
        </Link>
      ) : (
        <span className="rounded-md px-3 py-2 text-sm text-neutral-300">
          Dalsi
        </span>
      )}
    </nav>
  )
}
