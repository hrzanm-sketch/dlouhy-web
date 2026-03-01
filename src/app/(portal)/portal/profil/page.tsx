import { getPortalSession } from "@/lib/portal/get-session"
import { ProfileForm } from "./profile-form"
import Link from "next/link"

export const metadata = {
  title: "Profil",
}

export default async function ProfilPage() {
  const session = await getPortalSession()

  // TODO: Fetch company info from intranet DB by companyId
  const companyInfo = {
    name: "Demo Firma s.r.o.",
    ico: "12345678",
    address: "Prumyslova 42, 110 00 Praha 1",
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900">Profil</h1>

      {/* Company info */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Informace o firme
        </h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-sm text-neutral-500">Nazev firmy</dt>
            <dd className="text-sm font-medium text-neutral-900">
              {companyInfo.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">ICO</dt>
            <dd className="text-sm font-medium text-neutral-900">
              {companyInfo.ico}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Adresa</dt>
            <dd className="text-sm font-medium text-neutral-900">
              {companyInfo.address}
            </dd>
          </div>
        </dl>
      </section>

      {/* Profile form */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Osobni udaje
        </h2>
        <ProfileForm
          defaultValues={{
            firstName: session.firstName,
            lastName: session.lastName,
            email: session.email,
            phone: "",
            jobTitle: "",
          }}
        />
      </section>

      {/* Change password link */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Zabezpeceni
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Pro zmenu hesla pouzijte stranku zmeny hesla.
        </p>
        <Link
          href="/portal/profil/zmena-hesla"
          className="mt-4 inline-flex rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          Zmenit heslo
        </Link>
      </section>
    </div>
  )
}
