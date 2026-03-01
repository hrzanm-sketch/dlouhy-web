import { z } from "zod"

export const serviceRequestSchema = z.object({
  companyName: z.string().min(2, "Nazev firmy je povinny"),
  contactName: z.string().min(2, "Jmeno je povinne"),
  contactEmail: z.string().email("Neplatny email"),
  contactPhone: z.string().optional(),
  urgency: z.enum(["normal", "urgent", "critical"], {
    error: "Zvolte naleehavost",
  }),
  preferredDate: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(10, "Zprava musi mit alespon 10 znaku"),
  gdprConsent: z.literal(true, {
    error: "Souhlas s GDPR je povinny",
  }),
})

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>
