import { z } from "zod"

export const claimSchema = z.object({
  companyName: z.string().min(2, "Nazev firmy je povinny"),
  contactName: z.string().min(2, "Jmeno je povinne"),
  contactEmail: z.string().email("Neplatny email"),
  contactPhone: z.string().optional(),
  message: z.string().min(10, "Zprava musi mit alespon 10 znaku"),
  desiredResolution: z.enum(["repair", "replacement", "refund", "discount"], {
    error: "Zvolte pozadovane reseni",
  }),
  gdprConsent: z.literal(true, {
    error: "Souhlas s GDPR je povinny",
  }),
})

export type ClaimFormData = z.infer<typeof claimSchema>
