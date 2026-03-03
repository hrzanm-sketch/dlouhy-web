import { getPortalSession } from "@/lib/portal/get-session"
import { getCompanyInfo } from "@/lib/portal/queries"
import { ProfileForm } from "./profile-form"
import Link from "next/link"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const metadata = {
  title: "Profil",
}

export default async function ProfilPage() {
  const session = await getPortalSession()
  const company = await getCompanyInfo(session.companyId)

  // Fetch full user data for phone and jobTitle
  const [user] = await db
    .select({
      phone: portalUsers.phone,
      jobTitle: portalUsers.jobTitle,
    })
    .from(portalUsers)
    .where(eq(portalUsers.id, session.userId))
    .limit(1)

  const billingAddress = company?.addresses?.find((a) => a.type === "billing")

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900">Profil</h1>

      {/* Company info */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Informace o firmě
        </h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-neutral-500">Název firmy</dt>
            <dd className="text-sm font-medium text-neutral-900">
              {company?.name ?? "—"}
            </dd>
          </div>
          {company?.ico && (
            <div>
              <dt className="text-sm text-neutral-500">IČO</dt>
              <dd className="text-sm font-medium text-neutral-900">
                {company.ico}
              </dd>
            </div>
          )}
          {company?.dic && (
            <div>
              <dt className="text-sm text-neutral-500">DIČ</dt>
              <dd className="text-sm font-medium text-neutral-900">
                {company.dic}
              </dd>
            </div>
          )}
          {billingAddress && (
            <div>
              <dt className="text-sm text-neutral-500">Adresa</dt>
              <dd className="text-sm font-medium text-neutral-900">
                {billingAddress.street}, {billingAddress.zip} {billingAddress.city}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Profile form */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Osobní údaje
        </h2>
        <ProfileForm
          defaultValues={{
            firstName: session.firstName,
            lastName: session.lastName,
            email: session.email,
            phone: user?.phone ?? "",
            jobTitle: user?.jobTitle ?? "",
          }}
        />
      </section>

      {/* Change password link */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Zabezpečení
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Pro změnu hesla použijte stránku změny hesla.
        </p>
        <Link
          href="/portal/profil/zmena-hesla"
          className="mt-4 inline-flex rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          Změnit heslo
        </Link>
      </section>
    </div>
  )
}
