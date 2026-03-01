import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")

export const EMAIL_FROM = "Dlouhý Technology <noreply@dlouhy-technology.cz>"
