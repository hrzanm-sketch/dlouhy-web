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
        className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 lg:hidden"
      >
        Filtry
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
          "space-y-6 lg:block",
          open ? "mt-4 block" : "hidden"
        )}
      >
        {/* Category filter */}
        {showCategoryFilter && categories && categories.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">Kategorie</h3>
            <select
              value={currentCategory || ""}
              onChange={(e) => updateParam("category", e.target.value || null)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-dt-blue focus:outline-none focus:ring-1 focus:ring-dt-blue"
            >
              <option value="">Vsechny kategorie</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Manufacturer filter */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-900">Vyrobce</h3>
          <div className="space-y-2">
            {MANUFACTURERS.map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="manufacturer"
                  checked={currentManufacturer === m}
                  onChange={() => updateParam("manufacturer", currentManufacturer === m ? null : m)}
                  className="accent-dt-blue"
                />
                {m}
              </label>
            ))}
            {currentManufacturer && (
              <button
                type="button"
                onClick={() => updateParam("manufacturer", null)}
                className="text-xs text-neutral-500 underline hover:text-dt-blue"
              >
                Zrusit filtr
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
