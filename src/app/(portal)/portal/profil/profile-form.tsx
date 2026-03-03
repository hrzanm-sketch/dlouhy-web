"use client"

import { useActionState } from "react"
import { updateProfile } from "./actions"
import { cn } from "@/lib/utils"

type ProfileFormProps = {
  defaultValues: {
    firstName: string
    lastName: string
    email: string
    phone: string
    jobTitle: string
  }
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean; error?: string } | null, formData: FormData) => {
      return updateProfile(formData)
    },
    null,
  )

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-700"
          >
            Jméno
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue={defaultValues.firstName}
            required
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-700"
          >
            Příjmení
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={defaultValues.lastName}
            required
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={defaultValues.email}
          disabled
          className="mt-1 block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
        />
        <p className="mt-1 text-xs text-neutral-400">
          Email nelze změnit.
        </p>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-neutral-700"
        >
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="jobTitle"
          className="block text-sm font-medium text-neutral-700"
        >
          Pozice
        </label>
        <input
          id="jobTitle"
          name="jobTitle"
          type="text"
          defaultValue={defaultValues.jobTitle}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">Profil byl aktualizován.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light",
          pending && "cursor-not-allowed opacity-60",
        )}
      >
        {pending ? "Ukládám..." : "Uložit změny"}
      </button>
    </form>
  )
}
