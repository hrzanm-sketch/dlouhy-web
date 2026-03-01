"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormData } from "@/lib/validations/contact"
import { submitContact } from "@/app/(web)/kontakt/actions"

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      gdprConsent: undefined,
    },
  })

  async function onSubmit(data: ContactFormData) {
    setServerError(null)
    const result = await submitContact(data)
    if (result.success) {
      setSubmitted(true)
    } else {
      setServerError(result.error || "Nastala chyba")
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-6 py-8 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          Dekujeme za vasi zpravu
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Ozveme se vam co nejdrive.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Jmeno *
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Telefon
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Zprava *
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
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
            Souhlasim se zpracovanim osobnich udaju za ucelem vyrizeni dotazu. *
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
        {isSubmitting ? "Odesílám..." : "Odeslat zpravu"}
      </button>
    </form>
  )
}
