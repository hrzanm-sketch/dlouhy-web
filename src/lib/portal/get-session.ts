import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export type PortalSession = {
  userId: string
  companyId: string
  role: string
  firstName: string
  lastName: string
  email: string
}

export async function getPortalSession(): Promise<PortalSession> {
  const session = await auth()
  if (!session?.user) redirect("/portal/login")

  return {
    userId: session.user.id,
    companyId: session.user.companyId,
    role: session.user.role,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    email: session.user.email!,
  }
}
