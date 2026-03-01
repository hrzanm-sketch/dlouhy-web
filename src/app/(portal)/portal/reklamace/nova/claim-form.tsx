"use client"

import { useActionState } from "react"
import { submitClaim } from "./actions"
import { cn } from "@/lib/utils"

export function ClaimForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean; error?: string } | null, formData: FormData) => {
      return submitClaim(formData)
    },
    null,
  )

  if (state?.success) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg font-medium text-green-700">Reklamace byla odeslana.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Nas tym se Vam ozve do 48 hodin.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-neutral-700">
          Reklamovany produkt
        </label>
        <input
          id="product"
          name="product"
          type="text"
          required
          placeholder="napr. SAMSON Type 3241 DN80"
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-neutral-700">
          Cislo objednavky
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          type="text"
          placeholder="napr. OBJ-2025-0187"
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="desiredResolution" className="block text-sm font-medium text-neutral-700">
          Pozadovane reseni
        </label>
        <select
          id="desiredResolution"
          name="desiredResolution"
          required
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        >
          <option value="">Vyberte reseni</option>
          <option value="repair">Oprava</option>
          <option value="replacement">Vymena</option>
          <option value="refund">Vraceni penez</option>
          <option value="discount">Sleva</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
          Popis zavady
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          placeholder="Popiste co nejpresneji zjistenou zavadu..."
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-lg bg-dt-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light",
          pending && "cursor-not-allowed opacity-60",
        )}
      >
        {pending ? "Odesilam..." : "Odeslat reklamaci"}
      </button>
    </form>
  )
}
