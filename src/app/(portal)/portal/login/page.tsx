import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/portal/login-form"

export const metadata: Metadata = {
  title: "Prihlaseni do portalu",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-dt-blue">
              Dlouhy Technology
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Zakaznicky portal
            </p>
          </div>

          <LoginForm />

          <div className="mt-4 text-center">
            <Link
              href="/portal/reset-hesla"
              className="text-sm text-dt-blue hover:underline"
            >
              Zapomneli jste heslo?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
