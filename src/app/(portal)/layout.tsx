import { auth } from "@/lib/auth"
import { PortalSidebar } from "@/components/portal/sidebar"
import { getCompanyInfo } from "@/lib/portal/queries"

export const metadata = {
  title: {
    default: "Portal | Dlouhy Technology",
    template: "%s | Portal | Dlouhy Technology",
  },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // If not logged in, render children without sidebar (login page etc.)
  if (!session?.user) {
    return <>{children}</>
  }

  const company = await getCompanyInfo(session.user.companyId)
  const companyName = company?.name ?? "Portal"
  const userName = `${session.user.firstName} ${session.user.lastName}`

  return (
    <div className="flex h-screen overflow-hidden">
      <PortalSidebar companyName={companyName} userName={userName} />
      <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
        {children}
      </main>
    </div>
  )
}
