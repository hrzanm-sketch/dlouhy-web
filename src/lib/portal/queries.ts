// TODO: Replace with real Drizzle queries against intranet tables

export type Order = {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "completed"
  amount: number // in halere
  itemCount: number
}

export type Invoice = {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  status: "unpaid" | "paid" | "overdue"
  amount: number
}

export type DashboardData = {
  ordersCount: number
  invoicesCount: number
  serviceCount: number
  claimsCount: number
  recentOrders: Order[]
  unpaidInvoices: Invoice[]
}

// Mock data
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "OBJ-2026-0042",
    date: "2026-02-15",
    status: "shipped",
    amount: 1250000,
    itemCount: 3,
  },
  {
    id: "2",
    orderNumber: "OBJ-2026-0038",
    date: "2026-02-01",
    status: "completed",
    amount: 875000,
    itemCount: 1,
  },
  {
    id: "3",
    orderNumber: "OBJ-2026-0035",
    date: "2026-01-20",
    status: "completed",
    amount: 2340000,
    itemCount: 5,
  },
  {
    id: "4",
    orderNumber: "OBJ-2025-0198",
    date: "2025-12-10",
    status: "completed",
    amount: 456000,
    itemCount: 2,
  },
  {
    id: "5",
    orderNumber: "OBJ-2025-0187",
    date: "2025-11-28",
    status: "completed",
    amount: 1890000,
    itemCount: 4,
  },
]

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "FA-2026-0042",
    date: "2026-02-20",
    dueDate: "2026-03-20",
    status: "unpaid",
    amount: 1250000,
  },
  {
    id: "2",
    invoiceNumber: "FA-2026-0038",
    date: "2026-02-05",
    dueDate: "2026-03-05",
    status: "paid",
    amount: 875000,
  },
  {
    id: "3",
    invoiceNumber: "FA-2026-0035",
    date: "2026-01-25",
    dueDate: "2026-02-25",
    status: "overdue",
    amount: 2340000,
  },
  {
    id: "4",
    invoiceNumber: "FA-2025-0198",
    date: "2025-12-15",
    dueDate: "2026-01-15",
    status: "paid",
    amount: 456000,
  },
  {
    id: "5",
    invoiceNumber: "FA-2025-0187",
    date: "2025-12-02",
    dueDate: "2026-01-02",
    status: "paid",
    amount: 1890000,
  },
]

export async function getOrders(_companyId: string): Promise<Order[]> {
  // TODO: SELECT * FROM orders WHERE company_id = companyId
  return MOCK_ORDERS
}

export async function getOrderById(_companyId: string, orderId: string) {
  // TODO: Real query
  return MOCK_ORDERS.find((o) => o.id === orderId) ?? null
}

export async function getInvoices(_companyId: string): Promise<Invoice[]> {
  return MOCK_INVOICES
}

export async function getInvoiceById(_companyId: string, invoiceId: string) {
  return MOCK_INVOICES.find((i) => i.id === invoiceId) ?? null
}

export async function getDashboardData(
  _companyId: string,
): Promise<DashboardData> {
  return {
    ordersCount: 5,
    invoicesCount: 5,
    serviceCount: 2,
    claimsCount: 1,
    recentOrders: MOCK_ORDERS.slice(0, 3),
    unpaidInvoices: MOCK_INVOICES.filter((i) => i.status !== "paid"),
  }
}

// Service requests

export type ServiceRequest = {
  id: string
  requestNumber: string
  date: string
  status: "new" | "in_progress" | "completed" | "cancelled"
  subject: string
  description: string
}

const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "1",
    requestNumber: "SRV-2026-0012",
    date: "2026-02-10",
    status: "in_progress",
    subject: "Servis regulačního ventilu SAMSON 3241",
    description: "Výměna pohonu a seřízení",
  },
  {
    id: "2",
    requestNumber: "SRV-2025-0098",
    date: "2025-11-05",
    status: "completed",
    subject: "Preventivní údržba ventilové baterie",
    description: "Plánovaná údržba 5 ventilů",
  },
]

export async function getServiceRequests(
  _companyId: string,
): Promise<ServiceRequest[]> {
  return MOCK_SERVICE_REQUESTS
}

export async function getServiceRequestById(
  _companyId: string,
  id: string,
): Promise<ServiceRequest | null> {
  return MOCK_SERVICE_REQUESTS.find((sr) => sr.id === id) ?? null
}

// Claims

export type Claim = {
  id: string
  claimNumber: string
  date: string
  status: "new" | "investigating" | "resolved" | "rejected"
  subject: string
  description: string
}

const MOCK_CLAIMS: Claim[] = [
  {
    id: "1",
    claimNumber: "REC-2026-0003",
    date: "2026-01-15",
    status: "investigating",
    subject: "Vadný ventil typ 3241 — netěsnost",
    description: "Ventil vykazuje netěsnost po 2 měsících provozu",
  },
]

export async function getClaims(_companyId: string): Promise<Claim[]> {
  return MOCK_CLAIMS
}

export async function getClaimById(
  _companyId: string,
  id: string,
): Promise<Claim | null> {
  return MOCK_CLAIMS.find((c) => c.id === id) ?? null
}

// Documents

export type Document = {
  id: string
  name: string
  type: string
  fileUrl: string
  uploadedAt: string
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Certifikát ventilu SAMSON 3241",
    type: "certificate",
    fileUrl: "/documents/cert-3241.pdf",
    uploadedAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Protokol o zkoušce",
    type: "test_report",
    fileUrl: "/documents/test-report-42.pdf",
    uploadedAt: "2025-12-20",
  },
]

export async function getDocuments(_companyId: string): Promise<Document[]> {
  return MOCK_DOCUMENTS
}
