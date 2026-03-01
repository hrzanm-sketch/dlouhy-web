import { getPortalSession } from "@/lib/portal/get-session"
import { ChangePasswordForm } from "./change-password-form"
import Link from "next/link"

export const metadata = {
  title: "Zmena hesla",
}

export default async function ChangePasswordPage() {
  // Ensure user is logged in
  await getPortalSession()

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/portal/profil"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          &larr; Zpet na profil
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">
          Zmena hesla
        </h1>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <ChangePasswordForm />
      </section>
    </div>
  )
}
