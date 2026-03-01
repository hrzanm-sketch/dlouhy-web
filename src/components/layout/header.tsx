"use client"

import { useState } from "react"
import Link from "next/link"
import { NavItems } from "@/components/layout/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-dt-blue">
          Dlouhy Technology
        </Link>

        {/* Desktop nav */}
        <NavItems className="hidden items-center gap-6 lg:flex" />

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/portal/login"
            className="text-sm text-neutral-500 transition-colors hover:text-dt-blue"
          >
            Portal
          </Link>
          <Link
            href="/poptavka"
            className="rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
          >
            Poptavka
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 hover:text-dt-blue lg:hidden"
          aria-label={mobileOpen ? "Zavrit menu" : "Otevrit menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "overflow-hidden border-t border-neutral-200 bg-white transition-all duration-200 lg:hidden",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="space-y-1 px-4 py-4">
          <NavItems
            className="flex flex-col gap-1"
            itemClassName="block rounded-md px-3 py-2 text-base"
            onClick={() => setMobileOpen(false)}
          />
          <hr className="my-2 border-neutral-200" />
          <Link
            href="/portal/login"
            onClick={() => setMobileOpen(false)}
            className="block rounded-md px-3 py-2 text-base text-neutral-500 transition-colors hover:text-dt-blue"
          >
            Portal
          </Link>
          <Link
            href="/poptavka"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-md bg-dt-blue px-3 py-2 text-center text-base font-medium text-white transition-colors hover:bg-dt-blue-light"
          >
            Poptavka
          </Link>
        </div>
      </div>
    </header>
  )
}
