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
  if (pathname.startsWith("/portal") && !req.auth) {
    const loginUrl = new URL("/portal/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, public files
     * - API routes (handled by their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|admin).*)",
  ],
}
