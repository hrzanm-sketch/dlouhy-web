import { z } from "zod"

export const inquirySchema = z.object({
  companyName: z.string().min(2, "Nazev firmy je povinny"),
  contactName: z.string().min(2, "Jmeno je povinne"),
  contactEmail: z.string().email("Neplatny email"),
  contactPhone: z.string().optional(),
  ico: z.string().optional(),
  subject: z.string().min(3, "Predmet je povinny"),
  message: z.string().min(10, "Zprava musi mit alespon 10 znaku"),
  productId: z.string().uuid().optional().nullable(),
  gdprConsent: z.literal(true, {
    error: "Souhlas s GDPR je povinny",
  }),
  newsletterConsent: z.boolean().optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
