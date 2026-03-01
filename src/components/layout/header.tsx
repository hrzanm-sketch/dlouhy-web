"use client"

import { useState } from "react"
import Link from "next/link"
import { NavItems } from "@/components/layout/navigation"
import { SearchBar } from "@/components/layout/search-bar"
import { DtLogo } from "@/components/shared/dt-logo"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
      {/* Top accent bar */}
      <div className="h-[3px] bg-dt-blue" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-dt-blue">
          <DtLogo className="h-8" />
        </Link>

        {/* Desktop nav */}
        <NavItems className="hidden items-center gap-6 lg:flex" />

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 lg:flex">
          <SearchBar className="w-56" />
          <Link
            href="/portal/login"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-dt-blue hover:text-dt-blue"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Portál
          </Link>
          <Link
            href="/poptavka"
            className="rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-dt-blue-light"
          >
            Poptávka
          </Link>
        </div>

        {/* Mobile search + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => {
              setSearchOpen(!searchOpen)
              setMobileOpen(false)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 hover:text-dt-blue"
            aria-label="Hledat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen)
              setSearchOpen(false)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 hover:text-dt-blue"
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
      </div>

      {/* Mobile search bar */}
      <div
        className={cn(
          "overflow-hidden border-t border-neutral-200 bg-white px-4 transition-all duration-200 lg:hidden",
          searchOpen ? "max-h-20 py-3" : "max-h-0 border-t-0 py-0"
        )}
      >
        <SearchBar />
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
            className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:border-dt-blue hover:text-dt-blue"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Portál
          </Link>
          <Link
            href="/poptavka"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-md bg-dt-blue px-3 py-2 text-center text-base font-medium text-white transition-colors hover:bg-dt-blue-light"
          >
            Poptávka
          </Link>
        </div>
      </div>
    </header>
  )
}
