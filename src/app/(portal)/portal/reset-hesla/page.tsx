import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Obnova hesla",
}

async function requestReset(formData: FormData) {
  "use server"

  const email = formData.get("email") as string
  if (!email) return

  const [user] = await db
    .select()
    .from(portalUsers)
    .where(eq(portalUsers.email, email))
    .limit(1)

  if (!user) {
    // Don't reveal whether the email exists
    return
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await db
    .update(portalUsers)
    .set({
      inviteToken: token,
      inviteExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(portalUsers.id, user.id))

  console.log(`[Password Reset] Token for ${email}: ${token}`)
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-dt-blue">Obnova hesla</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Zadejte svuj email a my vam posleme odkaz pro obnovu hesla.
            </p>
          </div>

          <form action={requestReset} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
                placeholder="vas@email.cz"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dt-blue-light focus:ring-2 focus:ring-dt-blue focus:ring-offset-2 focus:outline-none"
            >
              Odeslat odkaz
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/portal/login"
              className="text-sm text-dt-blue hover:underline"
            >
              Zpet na prihlaseni
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
