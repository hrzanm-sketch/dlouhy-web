import { resend, EMAIL_FROM } from "./client"

type SendEmailOptions = {
  to: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[Email] Would send to ${to}: ${subject} (RESEND_API_KEY not set)`
    )
    return { success: true, mock: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    })
    if (error) {
      console.error("[Email] Send failed:", error)
      return { success: false, error }
    }
    return { success: true, id: data?.id }
  } catch (e) {
    console.error("[Email] Send exception:", e)
    return { success: false, error: e }
  }
}
