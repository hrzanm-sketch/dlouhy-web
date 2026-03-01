"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState } from "react"
import { MANUFACTURERS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function FilterSidebar({
  categories,
  showCategoryFilter = true,
}: {
  categories?: { slug: string; name: string }[]
  showCategoryFilter?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const currentManufacturer = searchParams.get("manufacturer")
  const currentCategory = searchParams.get("category")

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filtry
        </span>
        <svg
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <aside
        className={cn(
          "space-y-6 lg:sticky lg:top-24 lg:block",
          open ? "mt-4 block" : "hidden"
        )}
      >
        {/* Category filter */}
        {showCategoryFilter && categories && categories.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Kategorie
            </h3>
            <div className="relative">
              <select
                value={currentCategory || ""}
                onChange={(e) => updateParam("category", e.target.value || null)}
                className="w-full appearance-none rounded-md border border-neutral-200 bg-white px-3 py-2.5 pr-10 text-sm text-neutral-700 transition-colors focus:border-dt-blue focus:outline-none focus:ring-1 focus:ring-dt-blue"
              >
                <option value="">Vsechny kategorie</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}

        {/* Manufacturer filter */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Vyrobce
          </h3>
          <div className="space-y-2">
            {MANUFACTURERS.map((m) => (
              <label
                key={m}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  currentManufacturer === m
                    ? "bg-dt-blue-50 font-medium text-dt-blue"
                    : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    currentManufacturer === m
                      ? "border-dt-blue bg-dt-blue"
                      : "border-neutral-300"
                  )}
                >
                  {currentManufacturer === m && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <input
                  type="radio"
                  name="manufacturer"
                  checked={currentManufacturer === m}
                  onChange={() => updateParam("manufacturer", currentManufacturer === m ? null : m)}
                  className="sr-only"
                />
                {m}
              </label>
            ))}
            {currentManufacturer && (
              <button
                type="button"
                onClick={() => updateParam("manufacturer", null)}
                className="mt-1 flex items-center gap-1 px-3 text-xs text-neutral-500 transition-colors hover:text-dt-blue"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Zrusit filtr
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
