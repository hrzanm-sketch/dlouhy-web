import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Jmeno je povinne"),
  email: z.string().email("Neplatny email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Zprava musi mit alespon 10 znaku"),
  gdprConsent: z.literal(true, {
    error: "Souhlas s GDPR je povinny",
  }),
})

export type ContactFormData = z.infer<typeof contactSchema>
