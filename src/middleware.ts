import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Public portal routes — no auth required
  if (
    pathname.startsWith("/portal/login") ||
    pathname.startsWith("/portal/reset-hesla") ||
    pathname.startsWith("/portal/prvni-prihlaseni")
  ) {
    return NextResponse.next()
  }

  // Protected portal routes — require session
  if (!req.auth) {
    const loginUrl = new URL("/portal/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/portal/:path*"],
}
