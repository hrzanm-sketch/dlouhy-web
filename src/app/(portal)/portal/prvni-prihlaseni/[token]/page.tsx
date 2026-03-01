import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq, and, gt } from "drizzle-orm"
import { hash } from "bcryptjs"

export const metadata: Metadata = {
  title: "Prvni prihlaseni",
}

async function setInitialPassword(formData: FormData) {
  "use server"

  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!token || !password || password !== confirmPassword) {
    return
  }

  if (password.length < 8) {
    return
  }

  const [user] = await db
    .select()
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.inviteToken, token),
        gt(portalUsers.inviteExpiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!user) {
    return
  }

  const passwordHash = await hash(password, 12)

  await db
    .update(portalUsers)
    .set({
      passwordHash,
      isActive: true,
      inviteToken: null,
      inviteExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(portalUsers.id, user.id))

  redirect("/portal/login?activated=true")
}

export default async function FirstLoginPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const [user] = await db
    .select({ id: portalUsers.id, firstName: portalUsers.firstName })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.inviteToken, token),
        gt(portalUsers.inviteExpiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm text-center">
            <h1 className="text-xl font-bold text-red-600">
              Neplatna pozvanка
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Odkaz pro aktivaci uctu je neplatny nebo vyprsel.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-dt-blue">
              Dlouhy Technology
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Vitejte, {user.firstName}! Nastavte si heslo pro pristup do
              portalu.
            </p>
          </div>

          <form action={setInitialPassword} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-neutral-700"
              >
                Potvrzeni hesla
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dt-blue-light focus:ring-2 focus:ring-dt-blue focus:ring-offset-2 focus:outline-none"
            >
              Aktivovat ucet
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
