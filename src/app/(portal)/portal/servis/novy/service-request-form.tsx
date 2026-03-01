"use client"

import { useActionState } from "react"
import { submitServiceRequest } from "./actions"
import { cn } from "@/lib/utils"

export function ServiceRequestForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean; error?: string } | null, formData: FormData) => {
      return submitServiceRequest(formData)
    },
    null,
  )

  if (state?.success) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg font-medium text-green-700">Pozadavek byl odeslan.</p>
        <p className="mt-2 text-sm text-neutral-500">
          Nas servisni tym se Vam ozve do 24 hodin.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700">
            Typ servisu
          </label>
          <select
            id="type"
            name="type"
            required
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          >
            <option value="">Vyberte typ</option>
            <option value="inspection">Inspekce</option>
            <option value="repair">Oprava</option>
            <option value="calibration">Kalibrace</option>
            <option value="installation">Instalace</option>
          </select>
        </div>
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-neutral-700">
            Nalehavost
          </label>
          <select
            id="urgency"
            name="urgency"
            required
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          >
            <option value="normal">Normalni</option>
            <option value="urgent">Nahle</option>
            <option value="critical">Kriticka</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product" className="block text-sm font-medium text-neutral-700">
          Produkt / zarizeni
        </label>
        <input
          id="product"
          name="product"
          type="text"
          required
          placeholder="napr. SAMSON Type 3241 DN50"
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-neutral-700">
          Lokace
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="napr. Hala B, linka 3"
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-neutral-700">
          Preferovany termin
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
          Popis problemu
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          placeholder="Popiste co nejpresneji problem nebo pozadavek..."
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
        {pending ? "Odesilam..." : "Odeslat pozadavek"}
      </button>
    </form>
  )
}
