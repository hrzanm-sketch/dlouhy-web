const INTRANET_URL = process.env.INTRANET_API_URL || "http://localhost:3000"
const INTRANET_API_KEY = process.env.INTRANET_API_KEY

async function intranetFetch(path: string, options: RequestInit = {}) {
  if (!INTRANET_API_KEY) {
    console.log(
      `[Intranet] Would call ${options.method || "GET"} ${path} (INTRANET_API_KEY not set)`,
    )
    return { success: true, mock: true }
  }

  const res = await fetch(`${INTRANET_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": INTRANET_API_KEY,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Intranet API error ${res.status}: ${text}`)
  }

  return res.json()
}

export type NewBusinessCaseData = {
  companyName: string
  contactName: string
  email: string
  phone?: string
  product?: string
  message: string
  source: string
}

export async function createBusinessCase(data: NewBusinessCaseData) {
  return intranetFetch("/api/v1/cases", {
    method: "POST",
    body: JSON.stringify({ ...data, source: "web" }),
  })
}

export type NewServiceRequestData = {
  companyId: string
  contactName: string
  email: string
  phone?: string
  product: string
  serialNumber?: string
  description: string
}

export async function createServiceRequest(data: NewServiceRequestData) {
  return intranetFetch("/api/v1/service-requests", {
    method: "POST",
    body: JSON.stringify({ ...data, source: "web" }),
  })
}

export type NewClaimData = {
  companyId?: string
  companyName: string
  contactName: string
  email: string
  phone?: string
  product: string
  serialNumber?: string
  invoiceNumber?: string
  description: string
}

export async function createClaim(data: NewClaimData) {
  return intranetFetch("/api/v1/claims", {
    method: "POST",
    body: JSON.stringify({ ...data, source: "web" }),
  })
}
