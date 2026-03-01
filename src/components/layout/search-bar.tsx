"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type SearchResult = {
  slug: string
  name: string
  typeCode: string | null
  manufacturer: string
  categorySlug: string
}

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const search = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (term.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/web/search?q=${encodeURIComponent(term)}`)
        if (!res.ok) return
        const data = await res.json()
        setResults(data.results ?? [])
        setOpen(true)
        setActiveIndex(-1)
      } catch {
        // Silently fail on network errors
      }
    }, 300)
  }, [])

  const navigate = useCallback(
    (result: SearchResult) => {
      setOpen(false)
      setQuery("")
      router.push(`/produkty/${result.categorySlug}/${result.slug}`)
    },
    [router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      navigate(results[activeIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            search(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Hledat produkty..."
          className="w-full rounded-md border border-neutral-300 py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:outline-none focus:ring-1 focus:ring-dt-blue"
        />
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
          {results.map((result, idx) => (
            <button
              key={result.slug}
              type="button"
              onClick={() => navigate(result)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                idx === activeIndex
                  ? "bg-neutral-100"
                  : "hover:bg-neutral-50"
              )}
            >
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{result.name}</p>
                {result.typeCode && (
                  <p className="text-xs text-neutral-500">{result.typeCode}</p>
                )}
              </div>
              <span className="shrink-0 text-xs text-neutral-400">
                {result.manufacturer}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
