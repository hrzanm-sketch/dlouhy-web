"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { claimSchema, type ClaimFormData } from "@/lib/validations/claim"
import { submitClaim } from "@/app/(web)/reklamace/actions"

const RESOLUTION_OPTIONS = [
  { value: "repair", label: "Oprava" },
  { value: "replacement", label: "Vymena" },
  { value: "refund", label: "Vraceni penez" },
  { value: "discount", label: "Sleva" },
] as const

export function ClaimForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      gdprConsent: undefined,
    },
  })

  async function onSubmit(data: ClaimFormData) {
    setServerError(null)
    const result = await submitClaim(data)
    if (result.success) {
      router.push("/dekujeme/reklamace")
    } else {
      setServerError(result.error || "Nastala chyba")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Company name */}
        <div>
          <label
            htmlFor="companyName"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Nazev firmy *
          </label>
          <input
            id="companyName"
            type="text"
            {...register("companyName")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Contact name */}
        <div>
          <label
            htmlFor="contactName"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Kontaktni osoba *
          </label>
          <input
            id="contactName"
            type="text"
            {...register("contactName")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contactName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contactEmail"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Email *
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="contactPhone"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Telefon
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register("contactPhone")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          />
        </div>

        {/* Desired resolution */}
        <div className="sm:col-span-2">
          <label
            htmlFor="desiredResolution"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Pozadovane reseni *
          </label>
          <select
            id="desiredResolution"
            {...register("desiredResolution")}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          >
            <option value="">Zvolte...</option>
            {RESOLUTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.desiredResolution && (
            <p className="mt-1 text-sm text-red-600">
              {errors.desiredResolution.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Popis zavady *
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          placeholder="Popiste zavadu, okolnosti vzniku a cislo objednavky/faktury"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* File upload placeholder */}
      <div className="rounded-md border-2 border-dashed border-neutral-300 px-6 py-8 text-center text-sm text-neutral-500">
        Prilohy budou doplneny
      </div>

      {/* GDPR consent */}
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("gdprConsent")}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-dt-blue focus:ring-dt-blue"
          />
          <span className="text-sm text-neutral-600">
            Souhlasim se zpracovanim osobnich udaju za ucelem vyrizeni
            reklamace. *
          </span>
        </label>
        {errors.gdprConsent && (
          <p className="mt-1 text-sm text-red-600">
            {errors.gdprConsent.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-dt-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Odesílám..." : "Odeslat reklamaci"}
      </button>
    </form>
  )
}
