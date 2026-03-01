"use client"

import { useActionState } from "react"
import { changePassword } from "../actions"
import { cn } from "@/lib/utils"

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean; error?: string } | null, formData: FormData) => {
      return changePassword(formData)
    },
    null,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-neutral-700"
        >
          Soucasne heslo
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-neutral-700"
        >
          Nove heslo
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
        <p className="mt-1 text-xs text-neutral-400">
          Minimalne 8 znaku.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-neutral-700"
        >
          Potvrzeni noveho hesla
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">
          Heslo bylo uspesne zmeneno.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "w-full rounded-lg bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light",
          pending && "cursor-not-allowed opacity-60",
        )}
      >
        {pending ? "Menim heslo..." : "Zmenit heslo"}
      </button>
    </form>
  )
}
