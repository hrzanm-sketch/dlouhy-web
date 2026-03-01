import { z } from "zod"

export const orderStatusWebhookSchema = z.object({
  orderId: z.string(),
  orderNumber: z.string(),
  companyId: z.string(),
  status: z.enum(["pending", "confirmed", "shipped", "completed"]),
  description: z.string().optional(),
  updatedAt: z.string(),
})

export const newInvoiceWebhookSchema = z.object({
  invoiceId: z.string(),
  invoiceNumber: z.string(),
  companyId: z.string(),
  orderId: z.string().optional(),
  amount: z.number(),
  dueDate: z.string(),
  createdAt: z.string(),
})

export const serviceUpdateWebhookSchema = z.object({
  serviceRequestId: z.string(),
  requestNumber: z.string(),
  companyId: z.string(),
  status: z.enum(["new", "in_progress", "waiting_parts", "completed", "cancelled"]),
  description: z.string().optional(),
  updatedAt: z.string(),
})

export const claimUpdateWebhookSchema = z.object({
  claimId: z.string(),
  claimNumber: z.string(),
  companyId: z.string(),
  status: z.enum(["new", "investigating", "approved", "rejected", "resolved"]),
  description: z.string().optional(),
  updatedAt: z.string(),
})

export type OrderStatusWebhook = z.infer<typeof orderStatusWebhookSchema>
export type NewInvoiceWebhook = z.infer<typeof newInvoiceWebhookSchema>
export type ServiceUpdateWebhook = z.infer<typeof serviceUpdateWebhookSchema>
export type ClaimUpdateWebhook = z.infer<typeof claimUpdateWebhookSchema>
